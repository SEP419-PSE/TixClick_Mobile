const API_BASE_URL = "https://160.191.175.172:8443"

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

// Updated login function to match the new implementation
export const loginUser = async (userName: string, password: string): Promise<ApiResponse<AuthData>> => {
  try {
    console.log("Calling loginUser API with username:", userName);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }), // Using userName instead of username
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

// Keep other API functions as needed
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