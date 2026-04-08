import type { SyntheticEvent } from 'react'

const FALLBACK_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIi8+PC9zdmc+'

export function handleImageError(e: SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget
  target.onerror = null
  target.src = FALLBACK_SRC
  target.style.opacity = '0.3'
}
