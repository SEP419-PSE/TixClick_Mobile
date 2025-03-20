import axios from 'axios';

// Replace with your actual API base URL
const API_BASE_URL = "https://your-backend-api.com/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Authentication APIs
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", { name, email, password })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

// Events APIs
export const fetchEvents = async () => {
  try {
    const response = await api.get("/events")
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch events")
  }
}

// Tickets APIs
export const fetchUserTickets = async (token: string | null) => {
  try {
    const response = await api.get("/tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tickets")
  }
}

export const fetchTicketDetails = async (ticketId: string, token: string | null) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch ticket details")
  }
}

export const checkInTicket = async (ticketId: string, token: string | null) => {
  try {
    const response = await api.post(
      `/tickets/${ticketId}/check-in`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check in ticket")
  }
}

export const checkOutTicket = async (ticketId: string, token: string | null) => {
  try {
    const response = await api.post(
      `/tickets/${ticketId}/check-out`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check out ticket")
  }
}

