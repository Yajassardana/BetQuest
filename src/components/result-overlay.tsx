"use client"

import { motion } from "framer-motion"
import { useGame } from "@/context/game-context"
import { Button } from "@/components/ui/button"

export function ResultOverlay() {
  const { currentChallenge, resetChallenge, resultTimer } = useGame()
  const won = currentChallenge?.result === 'win'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6 p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-bold ${
            won ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {won ? 'Congratulations!' : 'Better luck next time!'}
        </motion.div>
        <div className="text-2xl font-bold">
          Next challenge starts in: {resultTimer}s
        </div>
        <Button
          onClick={resetChallenge}
          disabled={resultTimer > 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          Next Challenge
        </Button>
      </div>
    </motion.div>
  )
}

