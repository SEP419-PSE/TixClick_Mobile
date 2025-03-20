import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loginUser, registerUser } from "@/app/lib/api"

type AuthContextType = {
  user: any | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  token: null,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken")
        const storedUser = await AsyncStorage.getItem("userData")

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.log("Error loading auth data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredData()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await loginUser(email, password)

      const { user: userData, token: authToken } = response

      await AsyncStorage.setItem("userToken", authToken)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))

      setUser(userData)
      setToken(authToken)
    } catch (error) {
      console.log("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await registerUser(name, email, password)

      const { user: userData, token: authToken } = response

      await AsyncStorage.setItem("userToken", authToken)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))

      setUser(userData)
      setToken(authToken)
    } catch (error) {
      console.log("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken")
      await AsyncStorage.removeItem("userData")
      setUser(null)
      setToken(null)
    } catch (error) {
      console.log("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, token }}>{children}</AuthContext.Provider>
  )
}

