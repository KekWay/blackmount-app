'use client'

import { useState } from 'react'
import { X, Check, CreditCard } from 'lucide-react'

interface PaymentOverlayProps {
  open: boolean
  onClose: () => void
  amount: number
  label: string
  onSuccess: () => void
}

export function PaymentOverlay({ open, onClose, amount, label, onSuccess }: PaymentOverlayProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        setSuccess(false)
        setCardNumber('')
        setExpiry('')
        setCvc('')
      }, 1500)
    }, 2000)
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#14131c] rounded-3xl p-10 flex flex-col items-center border border-white/[0.08]">
          <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check size={32} className="text-green-400" />
          </div>
          <p className="text-xl text-white font-bold">Оплата прошла!</p>
          <p className="text-sm text-white/40 mt-2">{label}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#14131c] rounded-3xl w-[420px] border border-white/[0.08] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            <span className="text-base text-white font-bold">Оплата</span>
          </div>
          <button onClick={onClose} className="size-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center cursor-pointer transition-colors">
            <X size={14} className="text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-white/50">{label}</span>
            <span className="text-lg text-white font-bold">{amount} ₽</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Номер карты</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Срок</label>
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-medium">CVC</label>
              <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="000" className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full h-12 rounded-xl bg-primary hover:brightness-110 text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {processing ? 'Обработка...' : `Оплатить ${amount} ₽`}
          </button>
        </form>
      </div>
    </div>
  )
}
