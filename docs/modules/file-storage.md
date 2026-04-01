# Модуль: File Storage (Хранение файлов)

---

## Описание
Загрузка файлов пользователем (изображения для обработки нейросетью) и скачивание сгенерированных фото/видео. Автоудаление через 7 дней.

**Текущая реализация:** Скачивание изображений работает (кнопка «Скачать» в промптах и истории). Загрузка файлов — UI кнопки есть, но реальный upload не подключён (нет бэкенда). Аватар — первая буква имени вместо фото.
**TODO:** Supabase Storage (buckets, RLS), загрузка файлов, загрузка аватара, автоудаление.

## Статус реализации
- ✅ Кнопка «Скачать» в детальном просмотре промпта
- ✅ Кнопка «Скачать» в истории генераций
- ✅ Кнопка «+» в чате (меню с опцией прикрепления файла — UI готов)
- ✅ Аватар пользователя (заглушка — первая буква имени)
- ❌ Реальная загрузка файлов (upload в Supabase Storage)
- ❌ Загрузка аватара (фото профиля)
- ❌ Supabase Storage buckets и RLS
- ❌ Валидация файлов на сервере
- ❌ Автоудаление через 7 дней

## Лимиты файлов

### Загрузка пользователем (upload)
| Тип | Форматы | Макс. размер | Назначение |
|-----|---------|-------------|-----------|
| Изображения | PNG, JPG, JPEG, WebP | 10 MB | Обработка нейросетью (image-to-image, img2video) |

### Генерации (output от API)
| Тип | Форматы | Макс. размер | Назначение |
|-----|---------|-------------|-----------|
| Изображения | PNG, WebP | 20 MB | Результат генерации (NanoBanana, Flux) |
| Видео | MP4, WebM | 100 MB | Результат генерации (Kling, Veo 3.1) |

### Аватар пользователя
| Тип | Форматы | Макс. размер |
|-----|---------|-------------|
| Аватар | PNG, JPG, WebP | 2 MB |

## TODO: Supabase Storage — Buckets

```sql
-- 3 отдельных bucket:
-- 1. user-uploads — загрузки пользователей (приватный)
-- 2. generations — результаты генераций (приватный)
-- 3. avatars — аватары (публичный)
```

### Структура папок
```
user-uploads/
  {user_id}/
    {timestamp}-{filename}.png

generations/
  {user_id}/
    {timestamp}-{model_id}.png
    {timestamp}-{model_id}.mp4

avatars/
  {user_id}/
    avatar.png
```

### RLS политики Storage
```sql
-- user-uploads: только свои файлы
CREATE POLICY "Users upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users read own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- generations: только свои генерации
CREATE POLICY "Users read own generations" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generations' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- avatars: публичное чтение
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## TODO: Валидация при загрузке

```typescript
const ALLOWED_UPLOAD_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024  // 2 MB
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/files/upload | Загрузить файл (multipart/form-data) |
| GET | /api/files/download/[id] | Скачать файл (signed URL, 1 час) |
| DELETE | /api/files/[id] | Удалить файл |

## TODO: Автоудаление (7 дней)

Supabase Edge Function или pg_cron, ежедневно 03:00 UTC — удалить файлы старше 7 дней из buckets `user-uploads` и `generations`.
