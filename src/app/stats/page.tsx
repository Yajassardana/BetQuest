"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { GameProvider } from "@/context/game-context"
import { useAuth } from "@/context/auth-context"

function StatsContent() {
  const { userData } = useAuth()

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <Header />
      
      <main className="flex-1 p-4 pt-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Your Stats</h2>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Balance Tokens</h3>
            <p className="text-3xl font-bold">{userData?.tokens}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Current Streak: {userData?.contestsWon}</h3>
            <div className="flex gap-1">
              {/* {userData?.previousResults.map((result, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-sm ${
                    result === 'win'
                      ? 'bg-green-500'
                      : result === 'loss'
                      ? 'bg-red-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))} */}
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function StatsPage() {
  return (
    <GameProvider>
      <StatsContent />
    </GameProvider>
  )
}

