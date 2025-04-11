import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { checkApiConnection } from "../lib/api";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkConnection: () => Promise<boolean>;
  clearAllTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  checkConnection: async () => false,
  clearAllTokens: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        console.log('Loading stored authentication data')
        
        // FORCE CLEAR ALL TOKENS ON APP START
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("role")
        await AsyncStorage.removeItem("refreshToken")
        console.log('FORCED CLEARING OF ALL TOKENS ON APP START')
        
        // Now continue with normal flow, which should find no tokens
        const storedToken = await AsyncStorage.getItem("token")
        const storedRole = await AsyncStorage.getItem("role")
  
        if (storedToken && storedRole) {
          console.log('Stored token and role found')
          setToken(storedToken)
          setRole(storedRole)
          setIsLoggedIn(true)
        } else {
          console.log('No stored authentication data found')
          setToken(null)
          setRole(null)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.log("Error loading auth data:", error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
  
    loadStoredData()
  }, [])

  const checkConnection = async (): Promise<boolean> => {
    try {
      await checkApiConnection()
      return true
    } catch (error) {
      console.error("API connection check failed:", error)
      return false
    }
  }

  const login = async (newToken: string, userRole: string) => {
    try {
      console.log("Saving authentication data")
      await AsyncStorage.setItem("token", newToken)
      await AsyncStorage.setItem("role", userRole)
      
      setToken(newToken)
      setRole(userRole)
      setIsLoggedIn(true)
      
      console.log("Login successful")
      console.log("Token:", newToken)
      console.log("Role:", userRole)
    } catch (error) {
      console.error("Error saving auth data:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("Logging out...")
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("role")
      setToken(null)
      setRole(null)
      setIsLoggedIn(false)
      console.log("Logout successful")
    } catch (error) {
      console.log("Logout error:", error)
    }
  }

  const clearAllTokens = async () => {
    try {
      console.log('Clearing all stored tokens')
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("role")
      await AsyncStorage.removeItem("refreshToken")
      console.log('All tokens cleared')
      
      setToken(null)
      setRole(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      token, 
      role,
      login, 
      logout, 
      isLoading,
      checkConnection,
      clearAllTokens 
    }}>
      {children}
    </AuthContext.Provider>
  )
}