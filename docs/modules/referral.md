# Модуль: Referral (Реферальная программа)

## Таблица
```sql
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id),
  referred_id uuid NOT NULL REFERENCES profiles(id),
  bonus_percent integer NOT NULL DEFAULT 15,
  total_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);
```

## Логика
1. Реферер делится ссылкой `blackmount.app/?ref=CODE`
2. Регистрация → profiles.referred_by = referrer.id
3. Покупка referred → referrer получает bonus_percent%
4. Бонус по подпискам: Free 15%, Basic 20%, Pro 25%, Max 30%
5. Нарастание +5% с каждым уровнем подписки
