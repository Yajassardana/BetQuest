"use client"

import { motion } from "framer-motion"
import { GameProvider } from "@/context/game-context"
import { Header } from "@/components/header"
import { ChallengeCard } from "@/components/challenge-card"
import { Timer } from "@/components/timer"
import { Streak } from "@/components/streak"
import { ResultOverlay } from "@/components/result-overlay"
import { MissedVoteOverlay } from "@/components/missed-vote-overlay"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/game-context"
import { BottomNav } from "@/components/bottom-nav"

function DashboardContent() {
  const { currentChallenge, selectedOption, hasVoted, submitVote, gamePhase } = useGame()

  if (!currentChallenge) return null

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <Header />
      
      <main className="flex-1 p-4 pt-20 pb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h2 className="text-xl font-semibold">{currentChallenge.title}</h2>
        </motion.div>

        <div className="mb-8">
          <Timer />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {currentChallenge.options.map((option) => (
            <ChallengeCard key={option.id} {...option} />
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-6"
        >
          <Button
            onClick={submitVote}
            disabled={!selectedOption || hasVoted}
            className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Vote Now
          </Button>

          <Streak />
        </motion.div>
      </main>

      {gamePhase === 'result' && <ResultOverlay />}
      {gamePhase === 'missed' && <MissedVoteOverlay />}
      <BottomNav />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <GameProvider>
      <DashboardContent />
    </GameProvider>
  )
}

