'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { APP_ASSETS } from '@/lib/assets'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[248px] bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mt-[36px] mx-[20px]">
          <Link
            href="/"
            className="flex gap-[10px] items-center cursor-pointer"
            onClick={onClose}
            aria-label="Go to home page"
          >
            <Image
              src={APP_ASSETS.logo}
              alt="Black Mount logo"
              width={36}
              height={36}
              className="shrink-0 object-contain"
            />
            <span className="font-bakbak leading-[22px] not-italic text-[16px] text-white whitespace-nowrap">
              BLACK MOUNT
            </span>
          </Link>
          <button
            onClick={onClose}
            className="group size-[28px] flex items-center justify-center rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            <Image src="/icons/close_icon.png" alt="" width={14} height={14} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
          </button>
        </div>

        {/* Nav — close on link click */}
        <div className="flex-1 min-h-0" onClick={onClose}>
          <SidebarNav collapsed={false} />
        </div>

        <SidebarUser collapsed={false} />
      </aside>
    </>
  )
}
