'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    image: '/assets/models/46d72ecc2e7de51169acade3de4163e47b0ea22d.png',
  },
  {
    id: 'kling3',
    subtitle: 'Kling 3.0',
    description: 'Протестируйте новую нейросеть для генерации видео в лучшем качестве уже сейчас!',
    image: '/assets/models/5f9fde09629f4366a30a9b2273d3ef5eafec1674.png',
  },
  {
    id: 'claude4',
    subtitle: 'Claude 4 Opus',
    description: 'Новая флагманская модель Claude с улучшенным рассуждением и точностью!',
    image: '/assets/models/46d72ecc2e7de51169acade3de4163e47b0ea22d.png',
  },
  {
    id: 'sora2news',
    subtitle: 'Sora 2.0 HD',
    description: 'Генерация видео в 1080p стала доступна всем пользователям!',
    image: '/assets/models/5f9fde09629f4366a30a9b2273d3ef5eafec1674.png',
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
    <section className="mb-10" aria-label="News and updates">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-2xl text-white">News &amp; Updates</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Назад"
            className="bg-white/[0.06] hover:bg-white/[0.12] rounded-full size-8 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Вперёд"
            className="bg-white/[0.06] hover:bg-white/[0.12] rounded-full size-8 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 hidden-scrollbar"
      >
        {newsItems.map((item) => (
          <article key={item.id} className="shrink-0 w-[420px] flex flex-col gap-3">
            <div className="relative h-[240px] w-full rounded-[20px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.subtitle}
                fill
                className="object-cover opacity-80"
              />
            </div>
            <h3 className="font-maven font-extrabold text-xl text-white">{item.subtitle}</h3>
            <p className="font-maven text-[13px] text-white/60 leading-5">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
