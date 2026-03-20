'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const imgGeneratedImage = '/assets/models/46d72ecc2e7de51169acade3de4163e47b0ea22d.png'
const imgFrame32 = '/assets/models/5f9fde09629f4366a30a9b2273d3ef5eafec1674.png'
const imgImage31 = '/assets/models/9a402b089c2c29d5d7e2196840980b3b5e914e3c.png'

interface NewsItem {
  id: string
  subtitle: string
  description: string
  image: string
}

const newsItems: NewsItem[] = [
  {
    id: 'nb2',
    subtitle: 'NanoBanana 2',
    description: 'Протестируйте новую нейросеть для генерации фото уже сейчас!',
    image: imgGeneratedImage,
  },
  {
    id: 'kling3',
    subtitle: 'Kling 3.0',
    description: 'Протестируйте новую нейросеть для генерации видео в лучшем качестве уже сейчас!',
    image: imgFrame32,
  },
  {
    id: 'claude4',
    subtitle: 'Claude 4 Opus',
    description: 'Новая флагманская модель Claude с улучшенным рассуждением и точностью!',
    image: imgGeneratedImage,
  },
  {
    id: 'sora2news',
    subtitle: 'Sora 2.0 HD',
    description: 'Генерация видео в 1080p стала доступна всем пользователям!',
    image: imgFrame32,
  },
]

export function NewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -440 : 440,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mb-[40px]" aria-label="News and updates">
      <div className="flex items-center justify-between mb-[16px]">
        <h2 className="font-manrope font-semibold leading-[30px] not-italic text-[24px] text-white">
          News &amp; Updates
        </h2>
        <div className="flex gap-[8px]">
          <button
            onClick={() => scroll('left')}
            aria-label="Назад"
            className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[32px] h-[32px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Вперёд"
            className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[32px] h-[32px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-[20px] overflow-x-auto pb-[8px] hidden-scrollbar"
      >
        {newsItems.map((item) => (
          <article key={item.id} className="shrink-0 w-[420px] flex flex-col gap-[12px]">
            <div className="relative h-[240px] w-full rounded-[20px] overflow-hidden">
              <img
                src={item.image}
                alt={item.subtitle}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            </div>
            <h3 className="font-maven font-extrabold text-[20px] text-white">
              {item.subtitle}
            </h3>
            <p className="font-maven text-[13px] text-[rgba(255,255,255,0.6)] leading-[20px]">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
