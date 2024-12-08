"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from "@/context/game-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import {useAuth} from "@/context/auth-context"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const {userData, setUserData} = useAuth()

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("user is", userData)
    setIsLoading(true)
    // Simulating an API call
    const response = await fetch(`/api/users/${userData?.uid}`, {
      method: 'POST',
      body: JSON.stringify({tokens : amount}),
    });
    if (response.ok) {
      console.log("User updated");
    } else {
      console.error("User data");
    }
    setUserData((prev) => ({   
        ...prev,
        tokens: prev ? prev.tokens + amount : amount,
        contestsWon: prev ? prev.contestsWon : 0,
        streak: 0,
        previousResults: [],
        username: prev?.username || '',
        email: prev?.email || '',
        contestsLost: prev ? prev.contestsLost  : 0,
        walletAddress: prev?.walletAddress || '',
        uid: prev?.uid || ''
      }))
    setIsLoading(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Deposit Points</h2>
            <form onSubmit={handleDeposit}>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Depositing...
                    </>
                  ) : (
                    'Deposit'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

