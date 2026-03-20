export interface CompareRow {
  section?: string
  label?: string
  price?: number | null
  prices?: number[]
  basic?: string
  pro?: string
  max?: string
  isCoinValue?: boolean
}

export const COMPARE_ROWS: CompareRow[] = [
  { section: 'Видео (в месяц)' },
  { label: 'Sora 2 Pro', price: 115, basic: '2 видео', pro: '4 видео', max: '10 видео' },
  { label: 'Sora 2', price: 25, basic: '12 видео', pro: '22 видео', max: '48 видео' },
  { label: 'Veo 3.1 Quality', price: 185, basic: '1 видео', pro: '2 видео', max: '6 видео' },
  { label: 'Veo 3.1 Fast', price: 50, basic: '6 видео', pro: '11 видео', max: '24 видео' },
  { label: 'Kling 2.6', price: 45, basic: '6 видео', pro: '12 видео', max: '26 видео' },
  { label: 'Kling 2.5 Turbo', price: 35, basic: '8 видео', pro: '15 видео', max: '34 видео' },
  { section: 'Изображения (в месяц)' },
  { label: 'Flux 1.1 Pro Ultra', price: 15, basic: '20 изображений', pro: '36 изображений', max: '80 изображений' },
  { label: 'Flux 1 Pro', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { label: 'NanoBanana Pro', price: 22, basic: '13 изображений', pro: '25 изображений', max: '54 изображения' },
  { label: 'NanoBanana', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { section: 'Текст (в месяц)' },
  { label: 'ChatGPT 5.2 / Claude Opus 4.5', price: null, prices: [5, 8], basic: '40-60 запросов', pro: '70-110 запросов', max: '150-240 запросов' },
  { label: 'Claude Sonnet 3.7 / 4.5', price: 5, basic: '60 запросов', pro: '110 запросов', max: '240 запросов' },
  { label: 'ChatGPT 5 / Gemini 2.5 Pro', price: 3, basic: '100 запросов', pro: '183 запроса', max: '400 запросов' },
  { label: 'ChatGPT 5 mini / Gemini Flash 3 / Flash 2.5', price: 1, basic: '300 запросов', pro: 'Безлимит*', max: 'Безлимит*' },
  { section: 'Особенности' },
  { label: 'Ежемесячные айкоины', price: null, basic: '300', pro: '550', max: '1200', isCoinValue: true },
  { label: 'Скидка на пополнение', price: null, basic: '10%', pro: '15%', max: '20%' },
  { label: 'Приоритет в очереди', price: null, basic: 'Обычный', pro: 'Высокий', max: 'Максимальный' },
  { label: 'Размер контекста', price: null, basic: 'Увеличенный', pro: 'x2', max: 'x3' },
]
