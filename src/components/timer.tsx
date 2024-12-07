"use client"

import { motion } from "framer-motion"
import { useGame } from "@/context/game-context"

export function Timer() {
  const { timer, gamePhase } = useGame()
  
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="text-2xl font-bold tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-muted-foreground">
        {gamePhase === 'loading' ? 'Next challenge in' : 'Time remaining'}
      </div>
    </motion.div>
  )
}

