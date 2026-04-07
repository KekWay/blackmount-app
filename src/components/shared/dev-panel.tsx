'use client'

import { useState } from 'react'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import type { SubscriptionTier } from '@/types'

const OVERLAYS = [
  { id: 'auth-gate', label: 'Auth Gate' },
  { id: 'low-balance', label: 'Мало айкоинов' },
  { id: 'limit-reached', label: 'Лимит запросов' },
  { id: 'subscription-gate', label: 'Subscription Gate' },
  { id: 'payment', label: 'Оплата' },
  { id: 'support-choice', label: 'Выбор поддержки' },
] as const

type OverlayId = (typeof OVERLAYS)[number]['id']

export function DevPanel() {
  const [open, setOpen] = useState(false)
  const [activeOverlay, setActiveOverlay] = useState<OverlayId | null>(null)
  const [balanceInput, setBalanceInput] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const balance = useBalanceStore((s) => s.balance)
  const tier = useSubscriptionStore((s) => s.subscription.tier)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const setBalance = (val: number) => {
    const store = useBalanceStore.getState()
    const diff = val - store.balance
    if (diff > 0) store.addBalance(diff)
    else if (diff < 0) {
      store.deductBalance(Math.abs(diff))
    }
    showToast(`Баланс: ${val}`)
  }

  const setTier = (t: SubscriptionTier) => {
    const exp = t === 'free' ? null : new Date(Date.now() + 30 * 86400000).toISOString()
    useSubscriptionStore.getState().setSubscription(t, exp)
    if (t === 'free') {
      try { localStorage.removeItem('active_plan_key') } catch {}
    } else {
      const key = t
      try { localStorage.setItem('active_plan_key', key) } catch {}
    }
    showToast(`Подписка: ${t}`)
  }

  const resetAll = () => {
    setBalance(550)
    setTier('free')
    try {
      localStorage.removeItem('subscription')
      localStorage.removeItem('balance')
      localStorage.removeItem('active_plan_key')
    } catch {}
    window.location.reload()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[20px] right-[20px] z-[9999] size-[40px] rounded-full bg-[#888ae5] text-white flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(136,138,229,0.4)] hover:scale-110 transition-transform text-[16px] font-bold"
        title="Dev Panel"
      >
        D
      </button>
    )
  }

  return (
    <>
      <div className="fixed bottom-[20px] right-[20px] z-[9999] w-[320px] max-h-[80vh] overflow-y-auto chat-scrollbar bg-[#1a1926] border border-[rgba(255,255,255,0.1)] rounded-[16px] shadow-[0_16px_64px_rgba(0,0,0,0.6)] p-[16px] flex flex-col gap-[14px]">
        <div className="flex items-center justify-between">
          <span className="font-manrope font-bold text-[14px] text-white">Dev Panel</span>
          <button onClick={() => setOpen(false)} className="text-[rgba(255,255,255,0.4)] hover:text-white text-[18px] cursor-pointer transition-colors">&times;</button>
        </div>

        {/* Balance */}
        <Section title="Баланс">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <span className="text-[13px] text-white font-bold">{balance}</span>
            <span className="text-[11px] text-[rgba(255,255,255,0.4)]">айкоинов</span>
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {[0, 5, 20, 100, 550, 1200, 5000].map((v) => (
              <Btn key={v} label={String(v)} onClick={() => setBalance(v)} active={balance === v} />
            ))}
          </div>
          <div className="flex items-center gap-[6px] mt-[6px]">
            <input
              className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-[8px] px-[10px] py-[6px] text-[12px] text-white outline-none font-manrope"
              placeholder="Свой баланс..."
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => { if (e.key === 'Enter' && balanceInput) { setBalance(Number(balanceInput)); setBalanceInput('') } }}
            />
            <Btn label="OK" onClick={() => { if (balanceInput) { setBalance(Number(balanceInput)); setBalanceInput('') } }} />
          </div>
        </Section>

        {/* Subscription */}
        <Section title="Подписка">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <span className="text-[13px] text-white font-bold capitalize">{tier}</span>
          </div>
          <div className="flex flex-wrap gap-[6px]">
            {(['free', 'basic', 'pro', 'max'] as SubscriptionTier[]).map((t) => (
              <Btn key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} onClick={() => setTier(t)} active={tier === t} />
            ))}
          </div>
        </Section>

        {/* Overlays */}
        <Section title="Оверлеи и модалки">
          <div className="flex flex-wrap gap-[6px]">
            {OVERLAYS.map((o) => (
              <Btn key={o.id} label={o.label} onClick={() => setActiveOverlay(o.id)} />
            ))}
          </div>
        </Section>

        {/* Reset */}
        <button
          onClick={resetAll}
          className="w-full py-[8px] rounded-[10px] bg-[rgba(239,68,68,0.15)] text-[#ef4444] text-[12px] font-bold cursor-pointer hover:bg-[rgba(239,68,68,0.25)] transition-all"
        >
          Сбросить всё (reload)
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-[20px] right-[20px] z-[10000] bg-[#888ae5] text-white text-[12px] font-bold px-[14px] py-[8px] rounded-[10px] shadow-[0_4px_16px_rgba(136,138,229,0.4)] animate-pulse">
          {toast}
        </div>
      )}

      {/* Overlay previews */}
      {activeOverlay && <OverlayPreview id={activeOverlay} onClose={() => setActiveOverlay(null)} />}
    </>
  )
}

function OverlayPreview({ id, onClose }: { id: OverlayId; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] bg-[rgba(0,0,0,0.7)] flex items-center justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {id === 'auth-gate' && <AuthGatePreview onClose={onClose} />}
        {id === 'low-balance' && <LowBalancePreview onClose={onClose} />}
        {id === 'limit-reached' && <LimitReachedPreview onClose={onClose} />}
        {id === 'subscription-gate' && <SubscriptionGatePreview onClose={onClose} />}
        {id === 'payment' && <PaymentPreview onClose={onClose} />}
        {id === 'support-choice' && <SupportChoicePreview onClose={onClose} />}
      </div>
    </div>
  )
}

function AuthGatePreview({ onClose }: { onClose: () => void }) {
  return (
    <PreviewCard title="Auth Gate" onClose={onClose}>
      <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">Для генерации запросов необходимо войти в аккаунт. Просмотр чатов доступен без авторизации.</p>
      <div className="flex gap-[8px]">
        <PreviewBtn label="Войти" accent />
        <PreviewBtn label="Закрыть" onClick={onClose} />
      </div>
    </PreviewCard>
  )
}

function LowBalancePreview({ onClose }: { onClose: () => void }) {
  const balance = useBalanceStore((s) => s.balance)
  return (
    <PreviewCard title="Недостаточно айкоинов" onClose={onClose}>
      <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-[8px]">Нужно: <span className="text-white font-bold">8</span> айкоинов</p>
      <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">Ваш баланс: <span className="text-[#ef4444] font-bold">{balance}</span></p>
      <PreviewBtn label="Пополнить" accent />
    </PreviewCard>
  )
}

function LimitReachedPreview({ onClose }: { onClose: () => void }) {
  return (
    <PreviewCard title="Лимит запросов исчерпан" onClose={onClose}>
      <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">Вы исчерпали дневной лимит. Обновление через <span className="text-white font-bold">6ч 42м</span></p>
      <PreviewBtn label="Оформить подписку" accent />
    </PreviewCard>
  )
}

function SubscriptionGatePreview({ onClose }: { onClose: () => void }) {
  return (
    <PreviewCard title="Нужна подписка" onClose={onClose}>
      <p className="text-[13px] text-[rgba(255,255,255,0.6)] mb-[12px]">Модель <span className="text-white font-bold">Claude Opus 4.6</span> доступна только по подписке Pro или Max</p>
      <PreviewBtn label="Перейти к подпискам" accent />
    </PreviewCard>
  )
}

function PaymentPreview({ onClose }: { onClose: () => void }) {
  return (
    <PreviewCard title="Оплата" onClose={onClose}>
      <div className="flex flex-col gap-[8px] mb-[12px]">
        <div className="bg-[rgba(255,255,255,0.04)] rounded-[8px] px-[12px] py-[8px] text-[12px] text-[rgba(255,255,255,0.3)]">4276 **** **** ****</div>
        <div className="flex gap-[8px]">
          <div className="flex-1 bg-[rgba(255,255,255,0.04)] rounded-[8px] px-[12px] py-[8px] text-[12px] text-[rgba(255,255,255,0.3)]">MM/YY</div>
          <div className="w-[80px] bg-[rgba(255,255,255,0.04)] rounded-[8px] px-[12px] py-[8px] text-[12px] text-[rgba(255,255,255,0.3)]">CVC</div>
        </div>
      </div>
      <PreviewBtn label="Оплатить 999₽" accent />
    </PreviewCard>
  )
}

function SupportChoicePreview({ onClose }: { onClose: () => void }) {
  return (
    <PreviewCard title="Как связаться?" onClose={onClose}>
      <div className="flex flex-col gap-[8px]">
        <PreviewBtn label="Написать в поддержку" accent />
        <PreviewBtn label="Telegram" />
      </div>
    </PreviewCard>
  )
}

/* ── Shared UI ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] font-bold text-[rgba(255,255,255,0.35)] uppercase tracking-wider mb-[6px] block">{title}</span>
      {children}
    </div>
  )
}

function Btn({ label, onClick, active }: { label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-[10px] py-[5px] rounded-[8px] text-[11px] font-bold cursor-pointer transition-all ${active ? 'bg-[#888ae5] text-white' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'}`}
    >
      {label}
    </button>
  )
}

function PreviewCard({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="w-[360px] bg-[#1a1926] border border-[rgba(255,255,255,0.1)] rounded-[20px] p-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-[16px]">
        <span className="font-manrope font-bold text-[16px] text-white">{title}</span>
        <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white text-[18px] cursor-pointer">&times;</button>
      </div>
      {children}
    </div>
  )
}

function PreviewBtn({ label, accent, onClick }: { label: string; accent?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-[10px] rounded-[10px] text-[13px] font-bold cursor-pointer transition-all ${accent ? 'bg-[#888ae5] hover:bg-[#9a9cf0] text-white shadow-[0_4px_12px_rgba(136,138,229,0.3)]' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'}`}
    >
      {label}
    </button>
  )
}
