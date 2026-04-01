import type { AIModel } from '@/types/models'
import { getBasePrice } from '@/types/models'
import type { DocSection } from './knowledge-types'
import {
  iconAbout,
  iconVersions,
  iconUsecases,
  iconPrompts,
  iconTips,
  iconSettings,
} from './knowledge-icons'
import { getSectionAbout } from './section-content-about'
import { getSectionVersions } from './section-content-versions'
import { getSectionUsecases } from './section-content-usecases'
import { getSectionPrompts } from './section-content-prompts'
import { getSectionTips } from './section-content-tips'
import { getSectionSettings } from './section-content-settings'

export function getDocSections(model: AIModel): DocSection[] {
  const isText = model.category === 'text'
  const isImage = model.category === 'image'

  const versionsContent = getSectionVersions(model.id) ??
    model.versions.map(
      (v) =>
        `${v.label}${v.description ? ` — ${v.description}` : ''}. Стоимость: от ${getBasePrice(v.price)} монет за запрос.`
    )

  return [
    {
      id: 'about',
      title: 'О модели',
      icon: iconAbout(),
      content: getSectionAbout(model, isText, isImage),
    },
    {
      id: 'versions',
      title: 'Версии модели',
      icon: iconVersions(),
      content: versionsContent,
    },
    {
      id: 'usecases',
      title: 'Для чего подходит',
      icon: iconUsecases(),
      content: getSectionUsecases(isText, isImage, model.id),
    },
    {
      id: 'prompts',
      title: 'Как писать промпты',
      icon: iconPrompts(),
      content: getSectionPrompts(isText, isImage, model.id),
    },
    {
      id: 'tips',
      title: 'Советы и лучшие практики',
      icon: iconTips(),
      content: getSectionTips(isText, isImage, model.id),
    },
    {
      id: 'settings',
      title: 'Параметры и настройки',
      icon: iconSettings(),
      content: getSectionSettings(isText, isImage, model.id),
    },
  ]
}
