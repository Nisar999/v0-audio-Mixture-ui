"use client"

import { User } from "lucide-react"

function AwsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.68 28.2c-5.58 3.27-13.66 5.01-20.63 5.01-9.76 0-18.54-3.61-25.18-9.62-.52-.47-.06-1.11.57-.75 7.17 4.17 16.03 6.68 25.19 6.68 6.18 0 12.97-1.28 19.22-3.93.94-.4 1.73.62.83 1.61z" transform="translate(25 8)" fill="#FF9900"/>
      <path d="M24.87 25.68c-.71-.91-4.71-.43-6.5-.22-.55.07-.63-.41-.14-.75 3.18-2.24 8.4-1.59 9.01-.84.62.76-.16 6.01-3.15 8.52-.46.39-.89.18-.69-.33.67-1.67 2.18-5.47 1.47-6.38z" transform="translate(25 8)" fill="#FF9900"/>
      <path d="M18.52 4.18V1.59c0-.39.26-.65.59-.65h10.46c.34 0 .6.27.6.65v2.22c0 .37-.31.85-.86 1.58l-5.42 7.74c2.01-.05 4.14.25 5.96 1.28.41.23.52.57.55.91v2.77c0 .34-.38.74-.77.53-3.22-1.69-7.5-1.87-11.06.02-.36.2-.74-.2-.74-.54V15.5c0-.38.01-1.03.39-1.61l6.27-9H18.52z" transform="translate(0 8)" fill="currentColor"/>
      <path d="M-3.13 19.55h-3.18c-.3-.02-.54-.25-.57-.54V1.63c0-.33.27-.59.6-.59h2.97c.31.01.56.26.58.56v2.48h.06c.78-2.34 2.24-3.43 4.21-3.43 2 0 3.26 1.09 4.16 3.43.77-2.34 2.53-3.43 4.41-3.43 1.34 0 2.8.55 3.69 1.79 1.01 1.38.8 3.38.8 5.14v11.36c0 .33-.27.6-.6.6H10.83c-.31-.02-.56-.28-.56-.6V9.12c0-.69.06-2.41-.09-3.06-.24-1.09-.96-1.4-1.89-1.4-.78 0-1.59.52-1.92 1.35-.33.83-.3 2.22-.3 3.11v9.82c0 .33-.27.6-.6.6h-3.18c-.31-.02-.56-.28-.56-.6V9.12c0-1.83.3-4.52-1.98-4.52-2.32 0-2.23 2.62-2.23 4.52v9.82c0 .33-.27.6-.6.6z" transform="translate(37 8)" fill="currentColor"/>
    </svg>
  )
}

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <AwsLogo className="h-7 w-auto text-foreground" />
        <span className="text-base font-bold tracking-tight text-foreground">
          Air DJ
        </span>
      </div>

      {/* Status pill */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">
          {'Listening for '}<span className="text-foreground font-medium">{'"Hey Air DJ"'}</span>
        </span>
      </div>

      {/* Profile */}
      <button
        className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
        aria-label="User profile"
      >
        <User className="h-4 w-4 text-muted-foreground" />
      </button>
    </nav>
  )
}
