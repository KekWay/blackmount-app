import type { InstructionStep } from './knowledge-types'

export function getInstructions(
  category: 'text' | 'image' | 'video'
): InstructionStep[] {
  if (category === 'text') {
    return [
      { id: 1, title: 'Создание диалога', description: 'Как начать беседу и получить ответ от модели', gifPlaceholder: 'Демонстрация создания диалога' },
      { id: 2, title: 'Контекст и память', description: 'Как модель запоминает контекст разговора', gifPlaceholder: 'Работа с контекстом беседы' },
      { id: 3, title: 'Продвинутые промпты', description: 'Техники для получения лучших результатов', gifPlaceholder: 'Написание эффективных промптов' },
    ]
  }
  if (category === 'image') {
    return [
      { id: 1, title: 'Генерация изображения', description: 'Создание изображения из текстового описания', gifPlaceholder: 'Демонстрация генерации изображения' },
      { id: 2, title: 'Настройка стиля', description: 'Управление стилем и настроением результата', gifPlaceholder: 'Настройка стиля генерации' },
      { id: 3, title: 'Высокое разрешение', description: 'Получение HD-результатов максимального качества', gifPlaceholder: 'Работа с HD-генерацией' },
    ]
  }
  return [
    { id: 1, title: 'Создание видео', description: 'Генерация видеоролика из промпта', gifPlaceholder: 'Демонстрация генерации видео' },
    { id: 2, title: 'Управление камерой', description: 'Движение и углы камеры в видео', gifPlaceholder: 'Настройка движения камеры' },
    { id: 3, title: 'Длительность и формат', description: 'Выбор длины и качества выходного видео', gifPlaceholder: 'Настройка параметров видео' },
  ]
}
