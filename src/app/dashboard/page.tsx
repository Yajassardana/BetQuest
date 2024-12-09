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
import {useEffect} from "react"
import {useAuth} from "@/context/auth-context"

function DashboardContent() {
  const { currentChallenge, selectedOption, hasVoted, submitVote, gamePhase, setGameState, gameState, intervals, resetChallenge } = useGame()
  const {userData, setUserData, login} = useAuth()
  if (!currentChallenge) return null

  const updateUser  = async (won: boolean) => {
    console.log("Updating user", userData);
    const response = await fetch(`/api/users/${userData?.uid}`, {
      method: 'PUT',
      body: JSON.stringify({ result : won ? 'win' : 'loss' }),
    });
    if (response.ok) {
      console.log("User updated");
    } else {
      console.error("User data");
    }
  }
  
  useEffect(() => {
    const func = async () => {
      await login("0x00965f635e14f1b64eb60DC74eF7f418c12EA408451ceCE87d051d32E7d37171@gmail.com", "122334")
      // const res = await fetch('/api/contracts/start_game')
      // console.log("start game", res)
    }
    func();
   }, [])

   useEffect(() => {
    const func = async () => {
      if (userData!=null){const res = await fetch('/api/contracts/start_game')
        console.log("start game", res)
      }
      
    }
    func();
   }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    // Challenge going on
    if (gameState.timer > 0 && gameState.gamePhase === 'voting') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer - 1 }))
      }, 1000)
    }
    // result computation 
    else if (gameState.timer === 0 && gameState.gamePhase === 'voting') {
      if (gameState.hasVoted) {
        const won = (gameState.currentChallenge?.winnerId === gameState.selectedOption)
        
        setGameState(prev => ({
          ...prev,
          gamePhase: 'result',
          tokens: won ? prev?.tokens + 50 : prev?.tokens - 50,
          resultTimer: intervals.break,
          streak: [...gameState.streak, won ? 'win' : 'loss'],
          currentChallenge: {
            ...prev.currentChallenge!,
            result: won ? 'win' : 'loss'
          }
        }))

        if(won){
          setUserData((prev) => ({
            ...prev,
            tokens: prev ? prev.tokens + 50 : 50,
            contestsWon: prev ? prev.contestsWon + 1 : 1,
            streak: prev ? prev.streak + 1 : 1,
            previousResults: [],
            username: prev?.username || '',
            email: prev?.email || '',
            contestsLost: prev?.contestsLost || 0,
            walletAddress: prev?.walletAddress || '',
            uid: prev?.uid || ''
          }))
        }
        else{

          setUserData((prev) => ({   
            ...prev,
            tokens: prev ? prev.tokens - 50 : 50,
            contestsWon: prev ? prev.contestsWon : 0,
            streak: 0,
            previousResults: [],
            username: prev?.username || '',
            email: prev?.email || '',
            contestsLost: prev ? prev.contestsLost + 1 : 1,
            walletAddress: prev?.walletAddress || '',
            uid: prev?.uid || ''
          }))
        }
        updateUser(won)
      } else {
        setGameState(prev => ({
          ...prev,
          gamePhase: 'missed',
          resultTimer: intervals.break,
        }))
      }
    }
    // Break going on - either win/loss(result) or missed 
    else if (gameState.gamePhase === 'result' || gameState.gamePhase === 'missed') {
      interval = setInterval(() => {
        setGameState(prev => ({ 
          ...prev, 
          resultTimer: prev.resultTimer > 0 ? prev.resultTimer - 1 : 0
        }))
      }, 1000)

      if (gameState.resultTimer === 0) {
        resetChallenge()
      }
    }

    return () => clearInterval(interval)
  }, [gameState.timer, gameState.gamePhase, gameState.hasVoted, gameState.resultTimer])


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
            disabled={!selectedOption || !!hasVoted}
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

