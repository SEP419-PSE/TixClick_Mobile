import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ticket } from "../screens/Ticket/TicketsScreen";

const API_BASE_URL = "https://tixclick.site/api"

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
  role: string;
  status: string;
}

async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    
    if (data.success) {
      await AsyncStorage.setItem('token', data.result.accessToken);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

export const loginUser = async (userName: string, password: string): Promise<ApiResponse<AuthData>> => {
  try {
    console.log("Calling loginUser API with username:", userName);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }), 
    });

    const data = await response.json();
    console.log("Login API response:", data);

    if (data.code === 200) {
      return {
        success: true,
        data: {
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken,
          role: data.result.roleName,
          status: data.result.status,
        },
        message: data.message,
        code: data.code
      };
    } else {
      return {
        success: false,
        message: data.message || 'Đăng nhập thất bại',
        code: data.code,
      };
    }
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error('Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng');
  }
};



export const fetchUserTickets = async (token: string): Promise<Ticket[]> => {
  try {
    console.log("Fetching user tickets");
    
    const response = await fetch(`${API_BASE_URL}/ticket-purchase/all_of_account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      },
    });

    const data = await response.json();
    console.log("Tickets API response:", data);

    if (data.code === 0 || data.code === 200) {
      return data.result.map((item: any) => ({
        id: item.seatCode || String(Math.random()), 
        eventId: String(item.eventId),
        eventTitle: item.eventName,
        eventDate: item.eventDate + (item.eventStartTime ? 
          ` ${item.eventStartTime.hour}:${item.eventStartTime.minute}` : ''),
        eventLocation: item.location,
        ticketType: `${item.ticketType}${item.zoneName ? ` - ${item.zoneName}` : ''}`,
        status: "unused",
        qrCode: item.qrCode,
        price: item.price,
        quantity: item.quantity
      }));
    } else {
      console.error("Failed to fetch tickets:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Tickets API error:", error);
    throw new Error('Could not connect to server, please check your network connection');
  }
};


export const checkApiConnection = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || 'Connection successful',
    };
  } catch (error) {
    console.error("API connection check failed:", error);
    throw new Error('Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng');
  }
};