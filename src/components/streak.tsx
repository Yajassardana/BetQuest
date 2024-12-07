"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"

export function Streak() {
  const { userData } = useAuth()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <h3 className="text-sm font-medium text-muted-foreground">Streak</h3>
      <div className="flex gap-1">
        {userData?.previousResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`h-2 w-2 rounded-sm ${
                result === 'win'
                  ? 'bg-green-500'
                  : result === 'loss'
                  ? 'bg-red-500'
                  : 'bg-gray-700'
              }`}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

