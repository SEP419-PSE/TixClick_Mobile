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
      mode: 'cors',
      body: JSON.stringify({ userName, password }), 
    });
    console.log("url:", `${API_BASE_URL}/auth/login`),

    console.log("request body:", response);
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

export const fetchUserTickets = async (token: string, page = 1, sortDirection = "5"): Promise<{
  tickets: Ticket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
}> => {
  try {
    console.log(`Fetching user tickets - page: ${page}, sortDirection: ${sortDirection}`);

    const response = await fetch(
      `${API_BASE_URL}/ticket-purchase/all_of_account?page=${page}&sortDirection=${sortDirection}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      },
    );

    const data = await response.json();
    console.log("Tickets API response:", data);

    if (data.code === 0 || data.code === 200) {
      // Map the items array from the result
      const tickets = data.result.items.map((item: any) => ({
        eventId: item.eventId,
        eventActivityId: item.eventActivityId,
        ticketPurchaseId: item.ticketPurchaseId,
        eventCategoryId: item.eventCategoryId,
        eventName: item.eventName,
        eventDate: item.eventDate,
        eventStartTime: item.eventStartTime,
        timeBuyTicket: item.timeBuyTicket,
        locationName: item.locationName,
        location: item.location,
        price: item.price,
        seatCode: item.seatCode,
        ticketType: item.ticketType,
        qrCode: item.qrCode,
        zoneName: item.zoneName,
        quantity: item.quantity,
        ishaveSeatmap: item.ishaveSeatmap,
        logo: item.logo,
        banner: item.banner,
        // Add an id field for FlatList keyExtractor
        id: item.seatCode || String(Math.random()),
        // Add a status field (you may need to adjust this based on your actual data)
        status: "unused", // Default status, adjust as needed
      }));

      // Return both the tickets and pagination info
      return {
        tickets,
        pagination: {
          currentPage: data.result.currentPage,
          totalPages: data.result.totalPages,
          totalElements: data.result.totalElements,
          pageSize: data.result.pageSize,
        },
      };
    } else {
      console.error("Failed to fetch tickets:", data.message);
      return { tickets: [], pagination: { currentPage: 1, totalPages: 1, totalElements: 0, pageSize: 0 } };
    }
  } catch (error) {
    console.error("Tickets API error:", error);
    throw new Error("Could not connect to server, please check your network connection");
  }
};


