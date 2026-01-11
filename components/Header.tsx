"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bars3Icon, XMarkIcon, GiftIcon } from "@heroicons/react/24/outline"

export default function Header() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`bg-red-900 text-white fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 10 ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex-shrink-0">
            <Image src="/images/logopc.svg" alt="Mimo Meu e Seu" width={120} height={60} priority />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/home" className="text-white/90 hover:text-white font-medium transition-colors">
              Cartas da Mimo
            </Link>
            <Link
              href="/caixa-surprise"
              className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors"
            >
              <GiftIcon className="h-5 w-5" />
              Caixa Surprise Mimo
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-red-800 border-t border-red-700">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white/90 hover:text-white font-medium py-2 transition-colors"
            >
              Cartas da Mimo
            </Link>
            <Link
              href="/caixa-surprise"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-white/90 hover:text-white font-medium py-2 transition-colors"
            >
              <GiftIcon className="h-5 w-5" />
              Caixa Surprise Mimo
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
