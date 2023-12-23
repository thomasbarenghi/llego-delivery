import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { type FunctionComponent } from 'react'
import AuthSessionProvider from '@/context/providers/authSession.provider'
import NextUiProvider from '@/context/providers/nextUI.provider'
import dynamic from 'next/dynamic'
import { Toaster } from 'sonner'
const SWRProvider = dynamic(async () => await import('@/context/providers/swr.provider'), {
  ssr: false
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'LleGo!'
}

interface Props {
  children: React.ReactNode
}

const RootLayout: FunctionComponent<Props> = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={outfit.className}>
      <AuthSessionProvider>
        <NextUiProvider>
          <SWRProvider>
            <Toaster richColors />
            {children}
          </SWRProvider>
        </NextUiProvider>
      </AuthSessionProvider>
    </body>
  </html>
)

export default RootLayout
