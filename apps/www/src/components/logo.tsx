export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" width={24} height={24} className={className} aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D8AFF" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill="url(#logo-g)" />
      <path
        d="M151 161 L259 256 L151 351"
        stroke="#fff"
        strokeWidth="45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M289 351 L376 351" stroke="#fff" strokeWidth="45" strokeLinecap="round" />
    </svg>
  )
}
