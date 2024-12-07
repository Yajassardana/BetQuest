"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useGame } from "@/context/game-context"

interface ChallengeCardProps {
  id: string
  name: string
  image: string
}

export function ChallengeCard({ id, name, image }: ChallengeCardProps) {
  const { selectedOption, selectOption, hasVoted } = useGame()
  const isSelected = selectedOption === id

  return (
    <motion.div
      whileHover={{ scale: hasVoted ? 1 : 1.02 }}
      whileTap={{ scale: hasVoted ? 1 : 0.98 }}
      animate={{
        scale: isSelected ? 1.05 : 1,
        borderColor: isSelected ? "rgb(168, 85, 247)" : "rgb(63, 63, 70)",
      }}
      onClick={() => !hasVoted && selectOption(id)}
      className="w-full"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 ${
          hasVoted ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <div className="aspect-square overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="mt-2 text-center text-sm font-semibold">{name}</h3>
      </div>
    </motion.div>
  )
}

