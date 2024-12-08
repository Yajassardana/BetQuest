"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { GameProvider } from "@/context/game-context"

function RulesContent() {
  return (
    <div className="flex min-h-screen flex-col pb-20">
      <Header />
      
      <main className="flex-1 p-4 pt-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Game Rules</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">How to Play</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Choose between two options in each challenge</li>
                <li>Vote before the timer runs out</li>
                <li>Earn points for correct predictions</li>
                <li>Build your streak for bonus points</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Scoring</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Correct prediction: +50 points</li>
                <li>Incorrect prediction: -50 points</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function RulesPage() {
  return (
    <GameProvider>
      <RulesContent />
    </GameProvider>
  )
}

