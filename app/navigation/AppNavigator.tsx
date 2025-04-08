import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import LoginScreen from "../screens/Auth/LoginScreen"
import RegisterScreen from "../screens/Auth/RegisterScreen"
import HomeScreen from "../screens/Home/HomeScreen"
import TicketDetailsScreen from "../screens/Ticket/TicketDetailsScreen"
import TicketsScreen from "../screens/Ticket/TicketsScreen"


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

const TicketsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyTickets" component={TicketsScreen} options={{ title: "My Tickets" }} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: "Ticket Details" }} />
    </Stack.Navigator>
  )
}

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Tickets") {
            iconName = focused ? "ticket" : "ticket-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          borderTopColor: "#333",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tickets" component={TicketsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { isLoggedIn } = useAuth()
  
  console.log("Auth state in AppNavigator - isLoggedIn:", isLoggedIn)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator