"use client"

import { Coins, User } from 'lucide-react'
import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"

export function Header() {
  const { points, username } = useGame()
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-background to-transparent">
      <motion.h1 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
      >
        BetQuest
      </motion.h1>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
      >
        <Coins className="w-4 h-4 text-yellow-500" />
        <span>{points}</span>
      </motion.div>
      
      <motion.button
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
      >
        <User className="w-4 h-4" />
        <span>{username}</span>
      </motion.button>
    </div>
  )
}

