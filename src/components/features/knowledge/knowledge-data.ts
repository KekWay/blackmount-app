import type { AIModel } from '@/types/models'
import type { ModelDocs } from './knowledge-types'
import { getInstructions } from './knowledge-instructions-data'
import { getDocSections } from './knowledge-sections-data'

export const modelGroups = [
  { label: 'Текстовые', category: 'text' as const },
  { label: 'Изображения', category: 'image' as const },
  { label: 'Видео', category: 'video' as const },
]

export function getModelDocs(model: AIModel): ModelDocs {
  const isText = model.category === 'text'
  const isImage = model.category === 'image'

  return {
    intro: isText
      ? 'Текстовая нейросеть для диалога, кода и анализа'
      : isImage
        ? 'Нейросеть для генерации изображений из текста'
        : 'Нейросеть для генерации видео из текста',
    subtitle: `${model.versions.length} версий \u00b7 ${isText ? 'Текст' : isImage ? 'Изображения' : 'Видео'} \u00b7 от ${Math.min(...model.versions.map((v) => v.price || 0))} монет`,
    instructions: getInstructions(model.category),
    sections: getDocSections(model),
  }
}
