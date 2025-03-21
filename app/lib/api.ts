import axios from 'axios';

const API_BASE_URL = "http://160.191.175.172:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { username, password })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const response = await api.post("/auth/register", { username, email, password, firstName, lastName })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}



