"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Challenge, GameContextType, GameState } from "@/types/game"

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Which batsman will score more runs in the next 2 minutes?",
    options: [
      {
        id: "1",
        name: "Virat Kohli",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        name: "Rohit Sharma",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    duration: 60,
  },
  {
    id: "2",
    title: "Which team will take the next wicket?",
    options: [
      {
        id: "1",
        name: "India",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        name: "Australia",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    duration: 60,
  },
]

const initialState: GameState = {
  points: 1000,
  username: "player1",
  currentChallenge: mockChallenges[0],
  selectedOption: null,
  hasVoted: false,
  timer: 10,
  streak: Array(10).fill('pending'),
  gamePhase: 'voting',
  resultTimer: 5,
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (state.timer > 0 && state.gamePhase === 'voting') {
      interval = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer - 1 }))
      }, 1000)
    } else if (state.timer === 0 && state.gamePhase === 'voting') {
      if (state.hasVoted) {
        const won = true; // Replace with actual logic
        const newStreak = [...state.streak]
        const firstPendingIndex = newStreak.findIndex(s => s === 'pending')
        if (firstPendingIndex !== -1) {
          newStreak[firstPendingIndex] = won ? 'win' : 'loss'
        }
        
        setState(prev => ({
          ...prev,
          gamePhase: 'result',
          points: won ? prev.points + 100 : prev.points - 50,
          resultTimer: 30,
          streak: newStreak,
          currentChallenge: {
            ...prev.currentChallenge!,
            result: won ? 'win' : 'loss'
          }
        }))
      } else {
        resetChallenge()
      }
    } else if (state.gamePhase === 'result') {
      interval = setInterval(() => {
        setState(prev => ({ 
          ...prev, 
          resultTimer: prev.resultTimer > 0 ? prev.resultTimer - 1 : 0
        }))
      }, 1000)

      if (state.resultTimer === 0) {
        resetChallenge()
      }
    }

    return () => clearInterval(interval)
  }, [state.timer, state.gamePhase, state.hasVoted, state.resultTimer])

  const selectOption = (optionId: string) => {
    setState(prev => ({
      ...prev,
      selectedOption: optionId,
    }))
  }

  const submitVote = () => {
    setState(prev => ({
      ...prev,
      hasVoted: true,
    }))
  }

  const resetChallenge = () => {
    setState(prev => ({
      ...initialState,
      points: prev.points,
      streak: prev.streak,
      currentChallenge: mockChallenges[Math.floor(Math.random() * mockChallenges.length)],
    }))
  }

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectOption,
        submitVote,
        resetChallenge,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

