export interface Challenge {
  id: string
  title: string
  options: {
    id: string
    name: string
    image: string
  }[]
  duration: number
  result?: string
}

export interface GameState {
  points: number
  username: string
  currentChallenge: Challenge | null
  selectedOption: string | null
  hasVoted: boolean
  timer: number
  resultTimer : number
  streak: Array<'win' | 'loss' | 'pending'>
  gamePhase: 'voting' | 'result' | 'loading'
}

export interface GameContextType extends GameState {
  selectOption: (optionId: string) => void
  submitVote: () => void
  resetChallenge: () => void
}

