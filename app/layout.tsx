import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ItemsProvider } from "@/contexts/items-context"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Achados e Perdidos",
  description: "Sistema moderno para reportar e encontrar itens perdidos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">
        <ItemsProvider>
          {children}
          <Toaster />
        </ItemsProvider>
      </body>
    </html>
  )
}
