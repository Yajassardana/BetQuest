"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth, db } from '@/config/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  DocumentData
} from 'firebase/firestore'
import {Player} from '@/types/game'

interface AuthContextType {
  user: User | null;
  userData: Player | null;
  setUserData: React.Dispatch<React.SetStateAction<Player | null>>
  signup: (email: string, password: string, userData?: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      const { username, email, contestsWon, contestsLost, tokens, streak, previousResults, walletAddress} = userDoc.data()
      setUserData({
        username,
        email,
        contestsWon,
        contestsLost,
        tokens,
        streak,
        previousResults,
        walletAddress,
        uid : user?.uid
      })
    }
  }
  // username : string,
  // email : string,
  // contestsWon : number,
  // contestsLost : number,
  // tokens : number,
  // streak : number,
  // previousResults : Array<boolean>,
  // walletAddress : string
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string, userData?: any) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      ...userData,
      createdAt: new Date().toISOString(),
    })
    await fetchUserData(user.uid)
    return user
  }

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    await fetchUserData(user.uid)
    return user
  }

  const logout = async () => {
    await signOut(auth)
    setUserData(null)
  }

  const value = {
    user,
    userData,
    setUserData,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 