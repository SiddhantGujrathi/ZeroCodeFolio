// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          background: 'hsl(224 71.4% 4.1%)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="icon-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <path d="M16 18c-4-3-4-9 0-12" stroke="url(#icon-gradient)" />
          <path d="M8 6c4 3 4 9 0 12" stroke="url(#icon-gradient)" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
