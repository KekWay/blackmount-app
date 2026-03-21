# Модуль: Arena (Сравнение моделей)

## User Stories
- Выбираю 2 модели, отправляю промпт → 2 ответа рядом
- Голосую за лучший → обновляется ELO-рейтинг
- Могу выбрать «случайную пару»

## Таблицы
```sql
CREATE TABLE arena_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  prompt text NOT NULL,
  model_a text NOT NULL, response_a text NOT NULL,
  model_b text NOT NULL, response_b text NOT NULL,
  winner text NOT NULL CHECK (winner IN ('a','b','tie')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE model_ratings (
  model_id text PRIMARY KEY,
  wins integer DEFAULT 0, losses integer DEFAULT 0, ties integer DEFAULT 0,
  total_votes integer DEFAULT 0, elo_score integer DEFAULT 1200
);
```

## API
| Метод | Путь | Тело | Ответ |
|-------|------|------|-------|
| POST | /api/arena/battle | `{prompt, modelA, modelB}` | `{responseA, responseB, battleId}` |
| POST | /api/arena/vote | `{battleId, winner}` | `{updatedRatings}` |
| GET | /api/arena/leaderboard | — | `{ratings[]}` |

## ELO формула
K-фактор = 32. При победе: winner_elo += K * (1 - expected). При поражении: loser_elo += K * (0 - expected).
Expected = 1 / (1 + 10^((opponent_elo - player_elo) / 400))
