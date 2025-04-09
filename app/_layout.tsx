import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import "./global.css";
import AppNavigator from "./navigation/AppNavigator";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
    <StatusBar barStyle="light-content" backgroundColor="#121212" />
    <AppNavigator />
  </AuthProvider>
  );
}