import Image from 'next/image'
import { Layers, Lightbulb, Settings } from 'lucide-react'

const imgPuzzlesMask = '/assets/models/knowledge-puzzles.png'
const imgHandMask = '/assets/models/knowledge-hand.png'

function MaskIcon({ src }: { src: string }) {
  return (
    <div
      className="w-[15px] h-[15px]"
      style={{
        backgroundColor: 'currentColor',
        maskImage: `url('${src}')`,
        WebkitMaskImage: `url('${src}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

export function iconAbout() {
  return <Image src="/icons/info_icon.png" alt="" width={15} height={15} className="[filter:invert(60%)_sepia(50%)_saturate(500%)_hue-rotate(205deg)_brightness(95%)]" />
}

export function iconVersions() {
  return <Layers size={15} />
}

export function iconUsecases() {
  return <MaskIcon src={imgPuzzlesMask} />
}

export function iconPrompts() {
  return <Lightbulb size={15} />
}

export function iconTips() {
  return <MaskIcon src={imgHandMask} />
}

export function iconSettings() {
  return <Settings size={15} />
}
