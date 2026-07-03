import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy, Link2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // http / older browser fallback
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}

export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = useCallback(async (text: string) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    }
    return ok
  }, [])

  return { copied, copy }
}

export function CopyPromptButton({
  text,
  size = 'sm',
  variant = 'secondary',
  className,
  label = '复制 Prompt',
}: {
  text: string
  size?: 'sm' | 'default' | 'icon'
  variant?: 'secondary' | 'ghost' | 'outline' | 'default'
  className?: string
  label?: string
}) {
  const { copied, copy } = useCopy()
  return (
    <Button
      size={size}
      variant={variant}
      className={cn('gap-1.5', className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void copy(text)
      }}
    >
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
      {size !== 'icon' && (copied ? '已复制' : label)}
    </Button>
  )
}

export function ShareButton({
  id,
  title,
  size = 'sm',
  className,
}: {
  id: string
  title: string
  size?: 'sm' | 'default' | 'icon'
  className?: string
}) {
  const { copied, copy } = useCopy()

  const share = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/p/${id}`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user cancelled or unsupported -> fall through to copy
      }
    }
    void copy(url)
  }

  return (
    <Button size={size} variant="ghost" className={cn('gap-1.5', className)} onClick={share}>
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Link2 className="size-3.5" />}
      {size !== 'icon' && (copied ? '链接已复制' : '分享')}
    </Button>
  )
}
