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
          fontSize: 24,
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  )
}
