import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BGMI Tournament Manager",
  description: "Admin panel for managing BGMI tournaments and player wallets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'