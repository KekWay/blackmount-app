# Агент: Payments (Платежи)

> КРИТИЧЕСКИЙ агент. Claude Code ОБЯЗАН читать при любой работе с балансом, айкоинами, подписками, ЮKassa.

---

## Золотые правила платежей

```
1. НИКОГДА не начисляй айкоины до подтверждения платежа (webhook)
2. НИКОГДА не доверяй сумме от клиента — бери из БД
3. НИКОГДА не обрабатывай один платёж дважды (идемпотентность)
4. НИКОГДА не меняй баланс на клиенте — ТОЛЬКО через серверный RPC
5. ВСЕГДА проверяй подпись вебхука ЮKassa
6. ВСЕГДА используй атомарные транзакции
7. ВСЕГДА логируй ВСЕ платёжные операции
```

## Поток оплаты пакета айкоинов
```
1. Клиент → POST /api/balance/topup { packageId: 'advanced' }
2. Сервер → проверить auth, найти пакет, создать платёж в ЮKassa
3. ЮKassa → вернуть confirmation.redirect_url
4. Сервер → вернуть URL клиенту
5. Клиент → redirect на ЮKassa (пользователь платит)
6. ЮKassa → webhook POST /api/webhooks/yukassa { event: 'payment.succeeded' }
7. Сервер → проверить подпись → проверить идемпотентность → начислить айкоины
8. Клиент → вернулся на сайт → баланс обновлён
```

## Атомарное списание (RPC)
```sql
-- ОБЯЗАТЕЛЬНО использовать при каждой генерации
-- Нельзя: сначала проверить баланс, потом списать (race condition!)
-- Правильно: одна атомарная операция

CREATE FUNCTION deduct_coins(p_user_id uuid, p_cost int, p_label text, p_model_id text)
RETURNS json AS $$
DECLARE
  new_balance int;
BEGIN
  -- Атомарное списание: если coins < cost → ошибка
  UPDATE balances SET coins = coins - p_cost, updated_at = now()
    WHERE user_id = p_user_id AND coins >= p_cost
    RETURNING coins INTO new_balance;
    
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Записать операцию
  INSERT INTO operations (user_id, type, amount, label, model_id)
    VALUES (p_user_id, 'spent', -p_cost, p_label, p_model_id);
    
  RETURN json_build_object('success', true, 'balance', new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Проверка подписи вебхука
```typescript
// КАЖДЫЙ вебхук ОБЯЗАН проверять подпись
import crypto from 'crypto'

function verifyWebhookSignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.YUKASSA_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}
```

## Идемпотентность
```typescript
// ПЕРЕД начислением — проверить что платёж не обработан
const { data: existing } = await supabase
  .from('payments')
  .select('id')
  .eq('external_id', paymentId)
  .single()

if (existing) {
  // Уже обработан — вернуть OK без повторного начисления
  return Response.json({ ok: true })
}
```

## Чеклист для Claude Code
```
[ ] Баланс меняется ТОЛЬКО через RPC (не UPDATE напрямую)
[ ] Подпись вебхука проверена
[ ] Идемпотентность обеспечена
[ ] Операция залогирована в таблицу operations
[ ] Клиент НЕ передаёт сумму (берём из PACKAGES константы)
[ ] Auth проверен перед созданием платежа
[ ] Ошибки обработаны и залогированы
```
