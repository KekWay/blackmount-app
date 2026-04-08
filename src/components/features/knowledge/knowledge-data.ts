import type { AIModel } from '@/types/models'
import { getBasePrice } from '@/types/models'
import type { ModelDocs } from './knowledge-types'
import { getInstructions } from './knowledge-instructions-data'
import { getDocSections } from './knowledge-sections-data'

export const modelGroups = [
  { label: 'Текстовые', category: 'text' as const },
  { label: 'Изображения', category: 'image' as const },
  { label: 'Видео', category: 'video' as const },
]

const modelIntros: Record<string, { intro: string; subtitle: string }> = {
  chatgpt: {
    intro: 'Самая популярная нейросеть в мире от OpenAI',
    subtitle: '5 версий \u00b7 Текст \u00b7 от 1 монеты',
  },
  claude: {
    intro: 'Точность, код и глубокий анализ от Anthropic',
    subtitle: '6 версий \u00b7 Текст \u00b7 от 1.5 монет',
  },
  gemini: {
    intro: 'Семейство нейросетей от Google DeepMind',
    subtitle: '5 версий \u00b7 Текст \u00b7 от 1 монеты',
  },
  nanobanana: {
    intro: 'Генерация изображений с точным текстом от Google',
    subtitle: '3 версии \u00b7 Изображения \u00b7 от 7 монет',
  },
  flux: {
    intro: 'Фотореалистичные изображения от Black Forest Labs',
    subtitle: '2 версии \u00b7 Изображения \u00b7 от 7 монет',
  },
  kling: {
    intro: 'Генерация видео со звуком от Kuaishou',
    subtitle: '5 версий \u00b7 Видео \u00b7 от 35 монет',
  },
  veo31: {
    intro: 'Кинематографичное видео до 4K от Google DeepMind',
    subtitle: '2 версии \u00b7 Видео \u00b7 от 50 монет',
  },
}

export function getModelDocs(model: AIModel): ModelDocs {
  const isText = model.category === 'text'
  const isImage = model.category === 'image'

  const custom = modelIntros[model.id]

  return {
    intro: custom?.intro ?? (isText
      ? 'Текстовая нейросеть для диалога, кода и анализа'
      : isImage
        ? 'Нейросеть для генерации изображений из текста'
        : 'Нейросеть для генерации видео из текста'),
    subtitle: custom?.subtitle ?? `${model.versions.length} версий \u00b7 ${isText ? 'Текст' : isImage ? 'Изображения' : 'Видео'} \u00b7 от ${Math.min(...model.versions.map((v) => getBasePrice(v.price)))} монет`,
    instructions: getInstructions(model.category),
    sections: getDocSections(model),
  }
}
