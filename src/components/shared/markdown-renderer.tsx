'use client'

import { useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { CustomIcon } from './custom-icon'
import type { Components } from 'react-markdown'

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const language = className?.match(/language-(\w+)/)?.[1] ?? 'code'

  const handleCopy = useCallback(() => {
    const text = preRef.current?.textContent ?? ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="rounded-[12px] bg-[#0d0c14] border border-[rgba(255,255,255,0.06)] overflow-hidden mb-[12px]">
      <div className="bg-[rgba(255,255,255,0.03)] px-[14px] py-[8px] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <span className="text-[11px] text-[rgba(255,255,255,0.35)] uppercase tracking-wider font-medium">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="group flex items-center gap-[4px] text-[11px] text-[rgba(255,255,255,0.35)] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CustomIcon src="/icons/chekmark_icon.png" size={12} className="opacity-35 group-hover:opacity-100 transition-opacity duration-200" />
              Скопировано!
            </>
          ) : (
            <>
              <CustomIcon src="/icons/copy_icon.png" size={12} className="opacity-35 group-hover:opacity-100 transition-opacity duration-200" />
              Копировать
            </>
          )}
        </button>
      </div>
      <pre ref={preRef} className="px-[14px] py-[12px] overflow-x-auto text-[13px] leading-[20px] !bg-transparent">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

const components: Components = {
  p: ({ children }) => (
    <p className="text-[14px] text-white leading-[24px] mb-[10px] last:mb-0">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-[rgba(255,255,255,0.8)]">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} className="text-[#888ae5] hover:text-[#9a9cf0] underline transition-colors" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  h1: ({ children }) => <h1 className="text-[18px] font-bold text-white mt-[20px] mb-[8px] first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[16px] font-bold text-white mt-[16px] mb-[6px] first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-[15px] font-semibold text-white mt-[12px] mb-[4px] first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="md-ul pl-[20px] mb-[10px] flex flex-col gap-[4px] list-none">{children}</ul>,
  ol: ({ children }) => <ol className="pl-[20px] mb-[10px] flex flex-col gap-[4px] list-decimal marker:text-[#888ae5]">{children}</ol>,
  li: ({ children }) => <li className="text-[14px] text-[rgba(255,255,255,0.85)] leading-[22px]">{children}</li>,
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-') || className?.includes('hljs')
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>
    }
    return (
      <code className="bg-[rgba(136,138,229,0.12)] text-[#c4b5fd] px-[5px] py-[1px] rounded-[4px] text-[13px] font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-[10px] border border-[rgba(255,255,255,0.06)] mb-[12px]">
      <table className="w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-[rgba(255,255,255,0.03)] text-[12px] text-[rgba(255,255,255,0.5)] font-semibold px-[12px] py-[8px] text-left border-b border-[rgba(255,255,255,0.06)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-[13px] text-[rgba(255,255,255,0.7)] px-[12px] py-[8px] border-b border-[rgba(255,255,255,0.03)]">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-[#888ae5] pl-[14px] my-[12px] text-[rgba(255,255,255,0.6)] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-none h-[1px] bg-[rgba(255,255,255,0.06)] my-[16px]" />,
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
