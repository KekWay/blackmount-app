import { PlanComparison } from '@/components/features/subscription/plan-comparison'

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold text-foreground">
        Подписки
      </h1>
      <PlanComparison />
    </div>
  )
}
