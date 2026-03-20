import { Info, Layers, Lightbulb, Settings } from 'lucide-react'

const imgPuzzlesMask = '/assets/models/dbce83fd7b91426215fd28827bb7c0091aab9755.png'
const imgHandMask = '/assets/models/f127a884958b5808f0e28ee40e6baee71c140c8a.png'

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
  return <Info size={15} />
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
