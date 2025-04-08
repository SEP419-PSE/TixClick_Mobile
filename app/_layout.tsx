import { AuthProvider } from "./context/AuthContext";
import "./global.css";
import LoginScreen from "./screens/Auth/LoginScreen";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>
  );
}
