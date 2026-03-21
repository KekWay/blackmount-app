// Asset mappings — converted from Figma Make figma:asset imports
// Original source: components/ai-models-data.tsx

export const MODEL_ASSETS = {
  chatgpt: {
    // logoType: "mask", logo: null, maskImage used instead
    maskImage: '/assets/models/776b7a3e178d42a667d9e9145d8e831c5d29592c.png',
    colorLogo: '/assets/models/f39f1f5aad4a176c5160005f6b0e3db93b6a10ba.png',
    colorIcon: '/assets/models/chatgpt-color.png',
  },
  claude: {
    logo: '/assets/models/be562ae4a77434313994bd749c7d70c57defe30e.png',
    colorLogo: '/assets/models/89a56fcb15946b9582fc58d6740a02e12604885b.png',
  },
  gemini: {
    logo: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
    colorLogo: '/assets/models/464249cfa1e685e13ecdc8b3e4af7cc79b990682.png',
  },
  nanobanana: {
    logo: '/assets/models/e4164d5835b2d0292379d5cc43cd89624200875e.png',
    colorLogo: '/assets/models/1e85ee9196e56d0b7b7f9ae63141e794a1230a78.png',
  },
  flux: {
    logo: '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png',
    colorLogo: '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png',
    colorIcon: '/assets/models/flux-icon.png',
  },
  sora2: {
    // logoType: "mask", maskImage used as both logo and mask
    maskImage: '/assets/models/608060ad652feef63d189ada2f7bee4e5de1ade7.png',
    colorLogo: '/assets/models/d98e1b32ef3fb1ce881460f78ded0acd7aa8d1fa.png',
  },
  kling: {
    logo: '/assets/models/870622b36d40395068506055c2814966d24d175e.png',
    colorLogo: '/assets/models/9a402b089c2c29d5d7e2196840980b3b5e914e3c.png',
  },
  veo31: {
    logo: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
    colorLogo: '/assets/models/d6cc8c54df33e333e22af118845c45c06fa0e4f9.png',
  },
} as const

export const APP_ASSETS = {
  coin: '/assets/models/06a5a3f12f7ccb4092a793253a07d8e11e003ba7.png',
  logo: '/assets/models/e4ed614bc725465a9064a38e53c100a7a89134ee.png',
  settings: '/assets/models/8fee97ff103036ce0fa327530682bcb65c114bce.png',
  heroAuth: '/assets/models/9f605c2ecceca5ea76112912003926bd0b980430.png',
  yandex: '/assets/models/54a6d2a7109758545153beed5f2a6ac9679cfb57.png',
  vk: '/assets/models/460fa900cb854c292c04f912c360cff7cd6d4eb8.png',
  telegram: '/assets/models/cbf2b9da25b2b070233ad7346c823fff7c77ed58.png',
} as const

export type ModelId = keyof typeof MODEL_ASSETS
