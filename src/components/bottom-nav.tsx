"use client"

import { Home, Trophy, Book } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { icon: Home, label: 'Challenge', href: '/dashboard' },
  { icon: Trophy, label: 'Stats', href: '/stats' },
  { icon: Book, label: 'Rules', href: '/rules' },
]

export function BottomNav() {
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm border-t border-gray-800"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-col items-center">
            <item.icon className="h-6 w-6 text-gray-400" />
            <span className="text-xs mt-1 text-gray-400">{item.label}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  )
}

