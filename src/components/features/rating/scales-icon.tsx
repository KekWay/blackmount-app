const IMG_SCALES_MASK = '/assets/models/d61ee26f5cda2435e56a3af389505a597dde61b3.png'

export function ScalesIcon({ size, className }: { size: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        maskImage: `url('${IMG_SCALES_MASK}')`,
        WebkitMaskImage: `url('${IMG_SCALES_MASK}')`,
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
