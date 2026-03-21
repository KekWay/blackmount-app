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
  sora2: {
    // logoType: "mask", maskImage used as both logo and mask
    maskImage: '/assets/models/sora-logo.png',
    colorLogo: '/assets/models/sora-color-logo.png',
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
  logo: '/assets/models/logo.png',
  settings: '/assets/models/settings.png',
  heroAuth: '/assets/models/hero-auth.png',
  yandex: '/assets/models/yandex.png',
  vk: '/assets/models/vk.png',
  telegram: '/assets/models/telegram.png',
} as const

export type ModelId = keyof typeof MODEL_ASSETS
