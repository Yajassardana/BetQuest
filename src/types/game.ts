export interface Challenge {
  id: string
  title: string
  options: {
    id: string
    name: string
    image: string
  }[]
  winnerId: string
  duration: number
  result?: string
}

export interface GameState {
  tokens: number
  username: string | null
  currentChallenge: Challenge | null
  currentChallengeId : number
  selectedOption: string | null
  hasVoted: boolean | null
  timer: number 
  resultTimer : number
  streak: Array<'win' | 'loss'>
  gamePhase: 'voting' | 'result' | 'loading' | 'missed'
}

export interface GameContextType extends GameState {
  gameState: GameState
  intervals : Intervals
  selectOption: (optionId: string) => void
  submitVote: () => void
  resetChallenge: () => void
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export interface Intervals{
  challenge: number
  break: number
}

export interface Player {
  username : string,
  email : string,
  contestsWon : number,
  contestsLost : number,
  tokens : number,
  streak : number,
  previousResults : Array<'win' | 'loss'>
  walletAddress : string,
  uid : any
}