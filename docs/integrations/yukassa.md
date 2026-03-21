# Интеграция: ЮKassa (платежи)

## Описание
ЮKassa — платёжная система для приёма платежей в рублях. Поддерживает банковские карты, SBP, SberPay, T-Pay.

## Сценарии оплаты
1. Покупка пакета айкоинов (разовый платёж)
2. Оформление подписки (рекуррентный платёж)

## API
```
Base URL: https://api.yookassa.ru/v3/
Auth: Basic (shopId:secretKey)
```

## Создание платежа
```typescript
POST /payments
{
  "amount": { "value": "499.00", "currency": "RUB" },
  "capture": true,
  "confirmation": {
    "type": "redirect",
    "return_url": "https://blackmount.app/profile?payment=success"
  },
  "description": "Пакет ПРОДВИНУТЫЙ — 350 айкоинов",
  "metadata": { "user_id": "uuid", "package_id": "advanced" }
}
```

## Вебхук (подтверждение оплаты)
```typescript
// /api/webhooks/yukassa
POST → { event: "payment.succeeded", object: { id, status, amount, metadata } }

// Обработка:
1. Проверить подпись
2. Найти user_id из metadata
3. Начислить айкоины: UPDATE balances SET coins = coins + package.coins
4. Записать операцию: INSERT operations (type='topup', ...)
```

## Переменные окружения
```env
YUKASSA_SHOP_ID=123456
YUKASSA_SECRET_KEY=live_...
YUKASSA_WEBHOOK_SECRET=...
```

## Эквайринг
Комиссия 4% с каждого платежа. Учтена в ценообразовании пакетов.
