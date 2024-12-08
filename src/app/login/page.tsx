"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import {useAuth} from "@/context/auth-context"
import Link from 'next/link'
import { Loader2 } from 'lucide-react'



export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {login, userData} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const user = await login("0x07204BE2893083E6000aCd06d7Ede27cB6120953470B95D2203dEA813bb3B13A@gmail.com", "122334")
    console.log("user is", userData)
    // Here you would typically handle the login logic
    console.log("Login attempted with:", email, password)
    setLoading(false)
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-xl bg-background p-8 shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            BetQuest Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
          </div>
          {/* <div>Don't have an account? <Link href = "/signup" className="underline">Click here to Sign-up</Link></div> */}
        </form>
      </motion.div>
    </div>
  )
}

