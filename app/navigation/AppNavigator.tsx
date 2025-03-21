import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"

import LoginScreen from "../screens/Auth/LoginScreen"
import RegisterScreen from "../screens/Auth/RegisterScreen"
import { NavigationContainer } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}



const AppNavigator = () => {
    const { user } = useAuth()
  
  
  
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    )
  }
  
  export default AppNavigator