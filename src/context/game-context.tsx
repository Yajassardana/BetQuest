"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Challenge, GameContextType, GameState, Intervals } from "@/types/game"

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Which batsman will score more runs in the next 2 minutes?",
    options: [
      {
        id: "1",
        name: "Virat Kohli",
        image: "/images/kohli.jpg",
      },
      {
        id: "2",
        name: "Rohit Sharma",
        image: "/images/rohit.jpg",
      },
    ],
    winnerId: "1",
    duration: 15,
  },
  {
    id: "2",
    title: "Which team will take the next wicket?",
    options: [
      {
        id: "1",
        name: "India",
        image: "/images/india.jpeg",
      },
      {
        id: "2",
        name: "Australia",
        image: "/images/australia.png",
      },
    ],
    winnerId: "2",
    duration: 15,
  },
]

const intervals : Intervals = {
  challenge: 600,
  break: 600
} 


// username : string,
// email : string,
// contestsWon : number,
// contestsLost : number,
// tokens : number,
// streak : number,
// previousResults : Array<boolean>,
// walletAddress : string
const initialState: GameState = {
  tokens:  0,
  username: '',
  currentChallengeId : 0,
  currentChallenge: mockChallenges[0],
  selectedOption: null,
  hasVoted: false,
  timer: intervals.challenge,
  streak: [],
  gamePhase: 'voting',
  resultTimer: intervals.break,
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const selectOption = (optionId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedOption: optionId,
    }))
  }

  const submitVote = async () => {
    setGameState(prev => ({
      ...prev,
      hasVoted: true,
    }))
    await fetch('/api/contracts/play_game')
  }

  const resetChallenge = () => {
    setGameState(prev => ({
      ...initialState,
      tokens: prev.tokens,
      streak: prev.streak,
      currentChallengeId: (prev.currentChallengeId + 1)%mockChallenges.length,
      currentChallenge: mockChallenges[(prev.currentChallengeId + 1)%mockChallenges.length],
    }))
  }

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        gameState,
        intervals,
        selectOption,
        submitVote,
        resetChallenge,
        setGameState
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

