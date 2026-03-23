'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSharedStore } from '@/stores/shared'
import { getModelById } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'
import { formatDate } from '@/lib/utils'
import { SharePageMedia } from './share-page-media'

export default function SharePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const item = useSharedStore((s) => s.getItem(id))

  if (!item) {
    return (
      <div className="min-h-screen bg-[#121118] flex flex-col items-center justify-center gap-[20px] px-[20px]">
        <img src="/assets/models/search-empty.png" alt="" className="w-[64px] h-[64px] opacity-40" />
        <p className="text-[18px] text-white font-semibold">Генерация не найдена</p>
        <p className="text-[14px] text-[rgba(255,255,255,0.4)] text-center max-w-[320px]">
          Возможно, ссылка устарела или генерация была удалена
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-[8px] px-[24px] py-[12px] bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] text-[14px] text-white font-semibold transition-colors cursor-pointer"
        >
          На главную
        </button>
      </div>
    )
  }

  const model = getModelById(item.modelId)

  return (
    <div className="min-h-screen bg-[#121118] flex flex-col items-center">
      <div className="w-full max-w-[680px] px-[20px] py-[40px] flex flex-col gap-[32px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-[10px]">
          <img src="/assets/models/logo.png" alt="Blackmount" className="h-[28px]" />
        </div>

        {/* Card */}
        <div
          className="rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(136,138,229,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(136,138,229,0.12)',
            boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Model header */}
          <div className="flex items-center gap-[10px] px-[24px] py-[18px] border-b border-[rgba(255,255,255,0.06)]">
            {model && <ModelIcon modelId={model.id} size={32} />}
            <div>
              <p className="text-[15px] text-white font-semibold">{item.modelName}</p>
              <p className="text-[11px] text-[rgba(255,255,255,0.35)]">
                {formatDate(item.createdAt)}
              </p>
            </div>
          </div>

          {/* Prompt */}
          <div className="px-[24px] pt-[20px] pb-[16px]">
            <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[8px]">Промпт</p>
            <div className="bg-[rgba(255,255,255,0.04)] rounded-[14px] px-[16px] py-[14px]">
              <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[22px] whitespace-pre-wrap">
                {item.prompt}
              </p>
            </div>
          </div>

          {/* Response */}
          <div className="px-[24px] pb-[24px]">
            <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[8px]">Ответ</p>
            {item.type === 'text' ? (
              <div className="bg-[rgba(255,255,255,0.03)] rounded-[14px] px-[16px] py-[14px]">
                <p className="text-[14px] text-white leading-[23px] whitespace-pre-wrap">
                  {item.response}
                </p>
              </div>
            ) : (
              <SharePageMedia item={item} />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-[12px]">
          <button
            onClick={() => router.push('/')}
            className="px-[32px] py-[14px] bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[14px] text-[15px] text-white font-semibold transition-colors cursor-pointer shadow-[0_4px_20px_rgba(136,138,229,0.3)]"
          >
            Попробовать в Blackmount
          </button>
          <p className="text-[12px] text-[rgba(255,255,255,0.25)]">
            8 нейросетей в одном интерфейсе
          </p>
        </div>
      </div>
    </div>
  )
}
