/* ──── Prompt category type ──── */
export interface PromptCategory {
  id: string
  name: string
  description: string
  order: number
  group: 'main' | 'trending' | 'classic'
  accentColor: string
  images: string[]
}

/* ──── 30 prompt categories + favorites ──── */
export const promptCategories: PromptCategory[] = [
  { id: 'all', name: 'Все', description: 'Все промпты без фильтра', order: 1, group: 'main', accentColor: '#888AE5', images: [] },
  { id: 'favorites', name: 'Избранные', description: 'Промпты которые вы добавили в избранное', order: 2, group: 'main', accentColor: '#F59E0B', images: [] },
  { id: 'trends', name: 'Тренды', description: 'Самые популярные и вирусные промпты прямо сейчас', order: 3, group: 'main', accentColor: '#FF6B6B', images: [] },
  { id: 'holidays', name: 'Праздники', description: 'Новый год, 8 марта, 14 февраля, День рождения', order: 4, group: 'main', accentColor: '#FFD93D', images: [] },
  { id: 'photoshoots', name: 'Фотосессии', description: 'Деловой стиль, уличное фото, студийные портреты', order: 5, group: 'main', accentColor: '#6BCB77', images: [] },
  { id: 'portraits', name: 'Портреты и аватарки', description: 'Аватарки для Telegram/VK/Instagram, профессиональные фото', order: 6, group: 'main', accentColor: '#4D96FF', images: [] },
  { id: 'stylizations', name: 'Стилизации', description: 'Пиксар, Disney, Love Is, GTA, комиксы, ретро', order: 7, group: 'main', accentColor: '#9B59B6', images: [] },
  { id: 'cards', name: 'Открытки', description: 'Персональные открытки, поздравления, живые открытки', order: 8, group: 'main', accentColor: '#FF8FAB', images: [] },
  { id: 'animate', name: 'Оживление фото', description: 'Говорящие фото, танцующие портреты, lip sync', order: 9, group: 'main', accentColor: '#00D2FF', images: [] },
  { id: 'effects', name: 'Спецэффекты', description: 'Взрывы, магия, левитация, жидкий металл, огонь', order: 10, group: 'main', accentColor: '#FF4500', images: [] },
  { id: 'camera', name: 'Движения камеры', description: 'Дрон, crash zoom, панорама, 360° облёт, bullet time', order: 11, group: 'main', accentColor: '#7B68EE', images: [] },
  { id: 'cinema', name: 'Кинематограф', description: 'Кинематографичные сцены, эпичные кадры, слоу-мо', order: 12, group: 'main', accentColor: '#DAA520', images: [] },
  { id: 'commercial', name: 'Реклама', description: 'Промо товаров, packshot, продуктовые ролики', order: 13, group: 'main', accentColor: '#20B2AA', images: [] },
  { id: 'reels', name: 'Reels и TikTok', description: 'Вертикальные видео, вирусные форматы, шаблоны', order: 14, group: 'main', accentColor: '#FF1493', images: [] },
  { id: 'music', name: 'Музыка и клипы', description: 'Анимация под музыку, караоке, танцы, перформансы', order: 15, group: 'main', accentColor: '#8B5CF6', images: [] },
  { id: 'memes', name: 'Мемы', description: 'Смешные анимации, пародии, ситуативный контент', order: 16, group: 'main', accentColor: '#FBBF24', images: [] },
  { id: 'photorealism', name: 'Фотореализм', description: 'Продуктовая съёмка, еда, интерьеры, пейзажи', order: 17, group: 'main', accentColor: '#64748B', images: [] },
  { id: 'art', name: 'Арт и фэнтези', description: 'Концепт-арт, фэнтези, sci-fi, киберпанк, сюрреализм', order: 18, group: 'main', accentColor: '#A855F7', images: [] },
  { id: 'anime', name: 'Аниме', description: 'Аниме-портреты, манга, японская анимация', order: 19, group: 'main', accentColor: '#EC4899', images: [] },
  { id: 'design', name: 'Дизайн и бренд', description: 'Логотипы, обложки, баннеры, карточки, постеры', order: 20, group: 'main', accentColor: '#3B82F6', images: [] },
  { id: 'editing', name: 'Обработка фото', description: 'Улучшение качества, восстановление, ретушь, апскейл', order: 21, group: 'main', accentColor: '#14B8A6', images: [] },
  { id: 'fashion', name: 'Мода и стиль', description: 'Outfit-образы, streetwear, модные луки, fashion-съёмка', order: 22, group: 'trending', accentColor: '#E11D48', images: [] },
  { id: 'food', name: 'Еда и напитки', description: 'Фуд-фото, рецепты в картинках, ресторанная съёмка', order: 23, group: 'trending', accentColor: '#EA580C', images: [] },
  { id: 'travel', name: 'Путешествия', description: 'Локации мечты, туристические постеры, виды городов', order: 24, group: 'trending', accentColor: '#0EA5E9', images: [] },
  { id: 'business', name: 'Бизнес и продукт', description: 'Презентации товаров, мокапы упаковок, визитки', order: 25, group: 'trending', accentColor: '#6366F1', images: [] },
  { id: 'interiors', name: 'Интерьеры и архитектура', description: 'Дизайн комнат, экстерьеры, ландшафт, визуализация', order: 26, group: 'trending', accentColor: '#D97706', images: [] },
  { id: 'nature', name: 'Природа', description: 'Пейзажи, леса, озёра, закаты, цветы, горы', order: 27, group: 'classic', accentColor: '#16A34A', images: [] },
  { id: 'space', name: 'Космос', description: 'Галактики, планеты, астронавты, звёздное небо', order: 28, group: 'classic', accentColor: '#1E1B4B', images: [] },
  { id: 'animals', name: 'Животные', description: 'Питомцы, дикие животные, милые портреты', order: 29, group: 'classic', accentColor: '#CA8A04', images: [] },
  { id: 'urban', name: 'Города и улицы', description: 'Городские пейзажи, неон, ночной город, улицы', order: 30, group: 'classic', accentColor: '#475569', images: [] },
  { id: 'abstract', name: 'Абстракция и текстуры', description: 'Абстрактные композиции, паттерны, градиенты, фоны', order: 31, group: 'classic', accentColor: '#7C3AED', images: [] },
]

/* ──── Category group labels for panel ──── */
export const categoryGroupLabels: Record<PromptCategory['group'], string> = {
  main: 'Основные',
  trending: 'Актуальные темы',
  classic: 'Классические темы',
}

/* ──── Prompt data type ──── */
export interface PromptItem {
  id: number
  src: string
  type: 'image' | 'video'
  prompt: string
  modelId: string
  theme: string
  category?: string
  span?: string
}

/* ──── Mock prompt data ──── */
export const promptItems: PromptItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1765410849364-56b49c81c657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwcG9ydHJhaXQlMjBkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc3MjU1MTc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Surreal portrait of a woman made of fractal glass, ethereal lighting, 8k, hyperdetailed', modelId: 'nanobanana', theme: 'portrait', span: 'col-span-1 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwxfHx8fDE3NzI1MTg5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Cyberpunk city at night, neon signs reflecting in rain puddles, flying cars, cinematic', modelId: 'veo31', theme: 'cyberpunk', span: 'col-span-1 row-span-1' },
  { id: 3, src: 'https://images.unsplash.com/photo-1644328293665-a783b37f25d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwbWFnaWNhbHxlbnwxfHx8fDE3NzI0NzI1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Fantasy landscape with floating islands, magical aurora, crystal waterfalls, concept art style', modelId: 'flux', theme: 'fantasy', span: 'col-span-2 row-span-2' },
  { id: 4, src: 'https://images.unsplash.com/photo-1616651181620-9906d6e43fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZmx1aWQlMjBhcnR8ZW58MXx8fHwxNzcyNTUxNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Abstract fluid art composition, vibrant gradients of pink and gold, marble texture, 4k wallpaper', modelId: 'nanobanana', theme: 'abstract', span: 'col-span-1 row-span-1' },
  { id: 5, src: 'https://images.unsplash.com/photo-1768400730812-039f5971185d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBhbmRyb2lkfGVufDF8fHx8MTc3MjUzNjA2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Futuristic humanoid robot in a white lab, intricate mechanical parts visible, soft studio lighting', modelId: 'kling', theme: 'scifi', span: 'col-span-1 row-span-1' },
  { id: 6, src: 'https://images.unsplash.com/photo-1769118717400-69c5b0933e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBjaW5lbWF0aWMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI1NTE3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Dark moody cinematic portrait, dramatic rim lighting, smoke, film grain, 35mm aesthetic', modelId: 'flux', theme: 'dark', span: 'col-span-1 row-span-2' },
  { id: 7, src: 'https://images.unsplash.com/photo-1761920521457-ce2b0dbb67aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMGZvcmVzdCUyMG15c3RpY2FsJTIwbGlnaHR8ZW58MXx8fHwxNzcyNTUxNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Ethereal ancient forest, mystical light rays through canopy, bioluminescent moss, Studio Ghibli inspired', modelId: 'nanobanana', theme: 'nature', span: 'col-span-1 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/flagged/photo-1564783750566-e2d08c2bf293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMG5lYnVsYSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MjQ5MjUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Deep space nebula, swirling colorful gas clouds, stars being born, NASA Hubble style, 8k', modelId: 'veo31', theme: 'space', span: 'col-span-1 row-span-1' },
  { id: 9, src: 'https://images.unsplash.com/photo-1763552894947-adab0080f66b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW4lMjBkZWVwJTIwY3JlYXR1cmV8ZW58MXx8fHwxNzcyNTUxNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Underwater bioluminescent deep sea scene, giant jellyfish, coral reef, volumetric lighting', modelId: 'nanobanana', theme: 'sea', span: 'col-span-1 row-span-1' },
  { id: 10, src: 'https://images.unsplash.com/photo-1488693161025-5f967b74de89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmV0cm8lMjBmaWxtJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcyNTQxNTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Vintage Kodak film photo of a Parisian caf\u00e9 in the 1960s, warm golden tones, bokeh, nostalgic', modelId: 'flux', theme: 'retro', span: 'col-span-2 row-span-1' },
  { id: 11, src: 'https://images.unsplash.com/photo-1613723984367-a75ed372eb01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwdXJiYW4lMjBuaWdodCUyMHN0cmVldHxlbnwxfHx8fDE3NzI1NTE3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Neon-drenched Tokyo alley at night, rain-soaked streets, holographic ads, Blade Runner mood', modelId: 'veo31', theme: 'cyberpunk', span: 'col-span-1 row-span-1' },
  { id: 12, src: 'https://images.unsplash.com/photo-1665310127352-a7be56238f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGRyYW1hdGljJTIwc3Vuc2V0JTIwY2xvdWRzfGVufDF8fHx8MTc3MjU1MTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Dramatic mountain sunset with towering cumulonimbus clouds, golden hour, landscape photography', modelId: 'flux', theme: 'nature', span: 'col-span-1 row-span-1' },
  { id: 13, src: 'https://images.unsplash.com/photo-1762278804729-13d330fad71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnQlMjBuZW9ufGVufDF8fHx8MTc3MjQxODUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Abstract digital art with glowing neon geometric shapes, dark background, synthwave aesthetic', modelId: 'kling', theme: 'abstract', span: 'col-span-1 row-span-1' },
  { id: 14, src: 'https://images.unsplash.com/photo-1621238974931-8fe7b2ce4c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGdlbmVyYXRlZCUyMHN1cnJlYWwlMjBhcnR3b3JrfGVufDF8fHx8MTc3MjQ2MDk5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'AI-generated surreal artwork, melting clocks and impossible architecture, Dali meets digital', modelId: 'nanobanana', theme: 'fantasy', span: 'col-span-1 row-span-2' },
  { id: 15, src: 'https://images.unsplash.com/photo-1698897175977-f85b4b8b6d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmlnaHQlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyNDYwOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Cyberpunk megacity panorama, towering skyscrapers with holographic billboards, flying vehicles', modelId: 'veo31', theme: 'cyberpunk', span: 'col-span-2 row-span-2' },
  { id: 16, src: 'https://images.unsplash.com/photo-1609400590166-17c7173ee93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBvcnRyYWl0JTIwY3JlYXRpdmV8ZW58MXx8fHwxNzcyNDYwOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Creative colorful portrait with paint splashes, mixed media collage, vivid colors, editorial style', modelId: 'flux', theme: 'portrait', span: 'col-span-1 row-span-1' },
  { id: 17, src: 'https://images.unsplash.com/photo-1728995025396-b5141e209455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbGFuZHNjYXBlJTIwZGlnaXRhbHxlbnwxfHx8fDE3NzI0NjA5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Futuristic digital landscape, chrome terrain, digital sunrise, tron legacy style, 4k', modelId: 'nanobanana', theme: 'scifi', span: 'col-span-1 row-span-1' },
  { id: 18, src: 'https://images.unsplash.com/photo-1723283126778-c16ae4c2b0c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGNvbG9yZnVsJTIwcGF0dGVybnxlbnwxfHx8fDE3NzI0NjA5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Abstract geometric pattern animation, kaleidoscope of colors, seamless loop, satisfying motion', modelId: 'veo31', theme: 'abstract', span: 'col-span-1 row-span-1' },
]
