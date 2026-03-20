'use client'

import type { Tab } from './profile-data'
import { AccountTabHeader } from './account-tab-header'
import { AccountTabBalance } from './account-tab-balance'
import { AccountTabSubscription } from './account-tab-subscription'
import { AccountTabExtras } from './account-tab-extras'

export function AccountTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <AccountTabHeader />
      <AccountTabBalance onNavigateTopup={() => onNavigate('topup')} />
      <AccountTabSubscription onNavigateSubscription={() => onNavigate('subscription')} />
      <AccountTabExtras />
    </div>
  )
}
