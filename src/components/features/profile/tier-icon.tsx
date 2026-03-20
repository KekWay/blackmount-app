'use client'

import { IMG_LOGO } from './profile-data'

export function TierIcon({ gradientClass, size = 16 }: { gradientClass: string; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass}`}
        style={{
          maskImage: `url('${IMG_LOGO}')`,
          WebkitMaskImage: `url('${IMG_LOGO}')`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  )
}
