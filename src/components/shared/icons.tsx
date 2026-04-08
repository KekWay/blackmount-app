const IMG_SHARE_MASK = '/assets/models/share-mask.png'

interface MaskIconProps {
  src: string
  size: number
  className?: string
  color?: string
}

/** Универсальная mask-based иконка */
export function MaskIcon({ src, size, className, color }: MaskIconProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color || 'currentColor',
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

/** Иконка "Поделиться" */
export function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <MaskIcon src={IMG_SHARE_MASK} size={size} className={className} />
}
