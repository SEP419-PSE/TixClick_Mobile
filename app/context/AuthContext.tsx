import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  clearAllTokens: () => Promise<void>;
  register: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  clearAllTokens: async () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        console.log("Loading stored authentication data...");
        const storedToken = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");

        if (storedToken && storedRole) {
          console.log("Stored token and role found");
          setToken(storedToken);
          setRole(storedRole);
          setIsLoggedIn(true);
        } else {
          console.log("No stored authentication data found");
          setToken(null);
          setRole(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const login = async (newToken: string, userRole: string) => {
    try {
      console.log("Saving authentication data");
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("role", userRole);

      setToken(newToken);
      setRole(userRole);
      setIsLoggedIn(true);

      console.log("Login successful", { token: newToken, role: userRole });
    } catch (error) {
      console.error("Error saving auth data:", error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log("Registering user...");
  
      // Giả lập API call
      const response = await fetch("https://tixclick.site/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, firstName, lastName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
  
      const data = await response.json();  // server trả về { token, role }
      console.log("Registration successful:", data);
  
      await login(data.token, data.role);  // đăng nhập luôn sau khi đăng ký
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  
  
  const logout = async (extraKeysToClear: string[] = []) => {
    try {
      console.log("Logging out...");
      const keys = ["token", "role", ...extraKeysToClear];
      await AsyncStorage.multiRemove(keys);
  
      setToken(null);
      setRole(null);
      setIsLoggedIn(false);
  
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const clearAllTokens = async () => {
    try {
      console.log("Clearing all stored tokens");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("refreshToken");

      setToken(null);
      setRole(null);
      setIsLoggedIn(false);

      console.log("All tokens cleared");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        role,
        login,
        logout,
        isLoading,
        clearAllTokens,
        register, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
