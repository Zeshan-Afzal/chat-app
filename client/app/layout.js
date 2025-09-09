import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { SocketProvider } from '../contexts/SocketContext'
import SocketManager from '../components/SocketManager'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WhatsApp Clone',
  description: 'A secure chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <SocketManager />
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
