import { StatusBar } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import "./global.css";
import AppNavigator from "./navigation/AppNavigator";

export default function RootLayout() {
  return (
    <AuthProvider>
    <StatusBar barStyle="light-content" backgroundColor="#121212" />
    <AppNavigator />
  </AuthProvider>
  );
}