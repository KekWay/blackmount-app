// Asset mappings — converted from Figma Make figma:asset imports
// Original source: components/ai-models-data.tsx

export const MODEL_ASSETS = {
  chatgpt: {
    // logoType: "mask", logo: null, maskImage used instead
    maskImage: '/assets/models/chatgpt-logo.png',
    colorLogo: '/assets/models/chatgpt-color-logo.png',
    colorIcon: '/assets/models/chatgpt-color.png',
  },
  claude: {
    logo: '/assets/models/claude-logo.png',
    colorLogo: '/assets/models/claude-color-logo.png',
  },
  gemini: {
    logo: '/assets/models/gemini-logo.png',
    colorLogo: '/assets/models/gemini-color-logo.png',
  },
  nanobanana: {
    logo: '/assets/models/nanobanana-logo.png',
    colorLogo: '/assets/models/nanobanana-color-logo.png',
  },
  flux: {
    logo: '/assets/models/flux-logo.png',
    colorLogo: '/assets/models/flux-logo.png',
    colorIcon: '/assets/models/flux-icon.png',
  },
  kling: {
    logo: '/assets/models/kling-logo.png',
    colorLogo: '/assets/models/kling-color-logo.png',
  },
  veo31: {
    logo: '/assets/models/gemini-logo.png',
    colorLogo: '/assets/models/veo-color-logo.png',
  },
} as const

export const APP_ASSETS = {
  coin: '/assets/models/coin.png',
  coinLarge: '/assets/models/coin-large.png',
  logo: '/assets/models/logo.png',
  settings: '/assets/models/settings.png',
  heroAuth: '/assets/models/hero-auth.png',
  yandex: '/assets/models/yandex.png',
  vk: '/assets/models/vk.png',
  telegram: '/assets/models/telegram.png',
  sbpLogo: '/assets/models/sbp-logo.png',
  rocketIcon: '/assets/models/rocket_icon.png',
  wallet1: '/assets/models/wallet_1.png',
  wallet3: '/assets/models/wallet_3.png',
  referralIcon: '/assets/models/referall_icon.png',
} as const

export type ModelId = keyof typeof MODEL_ASSETS
