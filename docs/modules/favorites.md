# Модуль: Favorites (Избранные модели)

---

## Описание
Пользователь отмечает модели звёздочкой. Избранные показываются первыми на главной и доступны через фильтр «Избранные». В sidebar — быстрый доступ к избранным (до 4 иконок моделей).

**Текущие данные:** Zustand store с persist (localStorage).
**TODO:** Миграция на Supabase.

## Статус реализации
- ✅ Звёздочка на карточке модели (hover → появляется, клик → toggle)
- ✅ Жёлтая заливка звёздочки для избранных
- ✅ Фильтр «Избранные» на главной странице
- ✅ Избранные показываются первыми при фильтре «Все»
- ✅ Иконки избранных моделей в sidebar (до 4, клик → /chat/[modelId])
- ✅ event.stopPropagation() — клик по звёздочке не открывает чат
- ✅ Анимация при добавлении (scale bounce)
- ✅ Пустое состояние фильтра с подсказкой
- ✅ Persist в localStorage (сохраняется между сессиями)
- ❌ Серверное хранение (Supabase)
- ❌ API эндпоинты

## Zustand Store

Файл: `src/stores/favorites.ts`

```typescript
interface FavoritesState {
  favorites: string[]
  toggleFavorite: (modelId: string) => void
  isFavorite: (modelId: string) => boolean
}
```

Persist: localStorage, ключ `favorites-storage`.

## UI элементы
- Звёздочка (Star из lucide): opacity 0 → 1 при hover карточки
- Избранное: звёздочка залита жёлтым (#f5a623), всегда видна
- Sidebar: до 4 маленьких colorLogo иконок моделей, клик → `/chat/[modelId]`

## TODO: Таблица Supabase

```sql
CREATE TABLE favorite_models (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, model_id)
);

ALTER TABLE favorite_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON favorite_models
  FOR ALL USING (auth.uid() = user_id);
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/favorites | Список избранных моделей пользователя |
| POST | /api/favorites | Добавить `{ modelId }` |
| DELETE | /api/favorites/[modelId] | Убрать из избранных |
