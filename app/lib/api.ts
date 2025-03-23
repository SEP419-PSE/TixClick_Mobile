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

export const fetchEvents = async () => {
  try {
    const response = await api.get("/events")
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch events")
  }
}

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


