import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CustomIconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function CustomIcon({ src, alt = '', size = 20, className }: CustomIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('invert', className)}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
