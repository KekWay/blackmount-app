/* ──── Theme tags ──── */
export const themeTags = [
  { id: 'all', label: 'Все темы' },
  { id: 'nature', label: 'Природа' },
  { id: 'sea', label: 'Море и океан' },
  { id: 'space', label: 'Космос' },
  { id: 'fantasy', label: 'Фантастика' },
  { id: 'cyberpunk', label: 'Киберпанк' },
  { id: 'portrait', label: 'Портреты' },
  { id: 'abstract', label: 'Абстракция' },
  { id: 'architecture', label: 'Архитектура' },
  { id: 'animals', label: 'Животные' },
  { id: 'retro', label: 'Ретро' },
  { id: 'dark', label: 'Тёмное' },
  { id: 'scifi', label: 'Sci-Fi' },
]

/* ──── Prompt data type ──── */
export interface PromptItem {
  id: number
  src: string
  type: 'image' | 'video'
  prompt: string
  modelId: string
  theme: string
  span?: string
}

/* ──── Mock prompt data ──── */
export const promptItems: PromptItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1765410849364-56b49c81c657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwcG9ydHJhaXQlMjBkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc3MjU1MTc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Surreal portrait of a woman made of fractal glass, ethereal lighting, 8k, hyperdetailed', modelId: 'nanobanana', theme: 'portrait', span: 'col-span-1 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwxfHx8fDE3NzI1MTg5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Cyberpunk city at night, neon signs reflecting in rain puddles, flying cars, cinematic', modelId: 'sora2', theme: 'cyberpunk', span: 'col-span-1 row-span-1' },
  { id: 3, src: 'https://images.unsplash.com/photo-1644328293665-a783b37f25d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwbWFnaWNhbHxlbnwxfHx8fDE3NzI0NzI1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Fantasy landscape with floating islands, magical aurora, crystal waterfalls, concept art style', modelId: 'flux', theme: 'fantasy', span: 'col-span-2 row-span-2' },
  { id: 4, src: 'https://images.unsplash.com/photo-1616651181620-9906d6e43fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZmx1aWQlMjBhcnR8ZW58MXx8fHwxNzcyNTUxNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Abstract fluid art composition, vibrant gradients of pink and gold, marble texture, 4k wallpaper', modelId: 'nanobanana', theme: 'abstract', span: 'col-span-1 row-span-1' },
  { id: 5, src: 'https://images.unsplash.com/photo-1768400730812-039f5971185d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBhbmRyb2lkfGVufDF8fHx8MTc3MjUzNjA2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Futuristic humanoid robot in a white lab, intricate mechanical parts visible, soft studio lighting', modelId: 'kling', theme: 'scifi', span: 'col-span-1 row-span-1' },
  { id: 6, src: 'https://images.unsplash.com/photo-1769118717400-69c5b0933e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBjaW5lbWF0aWMlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI1NTE3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Dark moody cinematic portrait, dramatic rim lighting, smoke, film grain, 35mm aesthetic', modelId: 'flux', theme: 'dark', span: 'col-span-1 row-span-2' },
  { id: 7, src: 'https://images.unsplash.com/photo-1761920521457-ce2b0dbb67aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMGZvcmVzdCUyMG15c3RpY2FsJTIwbGlnaHR8ZW58MXx8fHwxNzcyNTUxNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Ethereal ancient forest, mystical light rays through canopy, bioluminescent moss, Studio Ghibli inspired', modelId: 'nanobanana', theme: 'nature', span: 'col-span-1 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/flagged/photo-1564783750566-e2d08c2bf293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMG5lYnVsYSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MjQ5MjUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Deep space nebula, swirling colorful gas clouds, stars being born, NASA Hubble style, 8k', modelId: 'veo31', theme: 'space', span: 'col-span-1 row-span-1' },
  { id: 9, src: 'https://images.unsplash.com/photo-1763552894947-adab0080f66b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW4lMjBkZWVwJTIwY3JlYXR1cmV8ZW58MXx8fHwxNzcyNTUxNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Underwater bioluminescent deep sea scene, giant jellyfish, coral reef, volumetric lighting', modelId: 'nanobanana', theme: 'sea', span: 'col-span-1 row-span-1' },
  { id: 10, src: 'https://images.unsplash.com/photo-1488693161025-5f967b74de89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmV0cm8lMjBmaWxtJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcyNTQxNTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Vintage Kodak film photo of a Parisian caf\u00e9 in the 1960s, warm golden tones, bokeh, nostalgic', modelId: 'flux', theme: 'retro', span: 'col-span-2 row-span-1' },
  { id: 11, src: 'https://images.unsplash.com/photo-1613723984367-a75ed372eb01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwdXJiYW4lMjBuaWdodCUyMHN0cmVldHxlbnwxfHx8fDE3NzI1NTE3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Neon-drenched Tokyo alley at night, rain-soaked streets, holographic ads, Blade Runner mood', modelId: 'sora2', theme: 'cyberpunk', span: 'col-span-1 row-span-1' },
  { id: 12, src: 'https://images.unsplash.com/photo-1665310127352-a7be56238f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGRyYW1hdGljJTIwc3Vuc2V0JTIwY2xvdWRzfGVufDF8fHx8MTc3MjU1MTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Dramatic mountain sunset with towering cumulonimbus clouds, golden hour, landscape photography', modelId: 'flux', theme: 'nature', span: 'col-span-1 row-span-1' },
  { id: 13, src: 'https://images.unsplash.com/photo-1762278804729-13d330fad71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnQlMjBuZW9ufGVufDF8fHx8MTc3MjQxODUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Abstract digital art with glowing neon geometric shapes, dark background, synthwave aesthetic', modelId: 'kling', theme: 'abstract', span: 'col-span-1 row-span-1' },
  { id: 14, src: 'https://images.unsplash.com/photo-1621238974931-8fe7b2ce4c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGdlbmVyYXRlZCUyMHN1cnJlYWwlMjBhcnR3b3JrfGVufDF8fHx8MTc3MjQ2MDk5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'AI-generated surreal artwork, melting clocks and impossible architecture, Dali meets digital', modelId: 'nanobanana', theme: 'fantasy', span: 'col-span-1 row-span-2' },
  { id: 15, src: 'https://images.unsplash.com/photo-1698897175977-f85b4b8b6d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmlnaHQlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcyNDYwOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Cyberpunk megacity panorama, towering skyscrapers with holographic billboards, flying vehicles', modelId: 'veo31', theme: 'cyberpunk', span: 'col-span-2 row-span-2' },
  { id: 16, src: 'https://images.unsplash.com/photo-1609400590166-17c7173ee93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBvcnRyYWl0JTIwY3JlYXRpdmV8ZW58MXx8fHwxNzcyNDYwOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Creative colorful portrait with paint splashes, mixed media collage, vivid colors, editorial style', modelId: 'flux', theme: 'portrait', span: 'col-span-1 row-span-1' },
  { id: 17, src: 'https://images.unsplash.com/photo-1728995025396-b5141e209455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbGFuZHNjYXBlJTIwZGlnaXRhbHxlbnwxfHx8fDE3NzI0NjA5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'image', prompt: 'Futuristic digital landscape, chrome terrain, digital sunrise, tron legacy style, 4k', modelId: 'nanobanana', theme: 'scifi', span: 'col-span-1 row-span-1' },
  { id: 18, src: 'https://images.unsplash.com/photo-1723283126778-c16ae4c2b0c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGNvbG9yZnVsJTIwcGF0dGVybnxlbnwxfHx8fDE3NzI0NjA5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', type: 'video', prompt: 'Abstract geometric pattern animation, kaleidoscope of colors, seamless loop, satisfying motion', modelId: 'sora2', theme: 'abstract', span: 'col-span-1 row-span-1' },
]
