export const SVG_CARD_PATH =
  'M0 20C0 8.95431 8.9543 0 20 0H138C149.046 0 158 8.9543 158 20V93C158 104.046 149.046 113 138 113H20C8.9543 113 0 104.046 0 93V20Z'

interface LogoImg {
  type: 'img'
  src: string
  left: number
  top: number
  width: number
  height: number
}

interface LogoMask {
  type: 'mask'
  src: string
  left: number
  top: number
  width: number
  height: number
  maskSize: string
  maskPosition: string
}

export interface CardConfig {
  bgType: 'div' | 'svg'
  bgOpacity: number
  svgStops?: { offset: number; color: string }[]
  text: { left: number; top: number; width: number; fontSize: number }
  logo: LogoImg | LogoMask
}

export const CARD_CONFIGS: Record<string, CardConfig> = {
  chatgpt: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 52, top: 51, width: 153, fontSize: 20 },
    logo: {
      type: 'mask',
      src: '/assets/models/876f00be72e92b592aa3ba2811a95ebda9f1bffe.png',
      left: 16, top: 37, width: 35.636, height: 40.727,
      maskSize: '28px 28px', maskPosition: '3.817px 6.364px',
    },
  },
  claude: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 63, top: 50, width: 75, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/be562ae4a77434313994bd749c7d70c57defe30e.png',
      left: 29, top: 43, width: 28, height: 28,
    },
  },
  gemini: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 58, top: 51, width: 75, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
      left: 10, top: 31, width: 46, height: 58,
    },
  },
  nanobanana: {
    bgType: 'svg',
    bgOpacity: 0.85,
    svgStops: [
      { offset: 0, color: '#CBD03C' },
      { offset: 1, color: '#DCCA7A' },
    ],
    text: { left: 43, top: 52, width: 109, fontSize: 17 },
    logo: {
      type: 'img',
      src: '/assets/models/e4164d5835b2d0292379d5cc43cd89624200875e.png',
      left: 7, top: 43, width: 28, height: 28,
    },
  },
  flux: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 71, top: 51, width: 75, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png',
      left: 25, top: 32, width: 50, height: 50,
    },
  },
  sora2: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 64, top: 48, width: 75, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/608060ad652feef63d189ada2f7bee4e5de1ade7.png',
      left: 28, top: 42, width: 28, height: 28,
    },
  },
  kling: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 69, top: 50, width: 75, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/870622b36d40395068506055c2814966d24d175e.png',
      left: 35, top: 42, width: 28, height: 28,
    },
  },
  veo31: {
    bgType: 'div',
    bgOpacity: 0.65,
    text: { left: 60, top: 49, width: 153, fontSize: 20 },
    logo: {
      type: 'img',
      src: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
      left: 11, top: 30, width: 46, height: 58,
    },
  },
}
