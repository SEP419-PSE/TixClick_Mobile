import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import TicketDetailsScreen from "../screens/Ticket/TicketDetailsScreen";
import TicketsScreen from "../screens/Ticket/TicketsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const TicketsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MyTickets" component={TicketsScreen} options={{ title: "Vé của tôi" }} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: "Chi tiết vé" }} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Vé của tôi"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Trang chủ") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Vé của tôi") {
          iconName = focused ? "ticket" : "ticket-outline";
        } else if (route.name === "Cá nhân") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#FF8C00",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "#1E1E1E",
        borderTopColor: "#333",
      },
    })}
  >
    <Tab.Screen name="Vé của tôi" component={TicketsStack} options={{ headerShown: false }} />
    <Tab.Screen name="Trang chủ" component={HomeScreen} />
    <Tab.Screen name="Cá nhân" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  console.log("Auth state in AppNavigator:", { isLoggedIn, isLoading });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E" }}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
