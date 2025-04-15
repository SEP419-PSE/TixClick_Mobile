import { useAuth } from "@/app/context/AuthContext";
import { loginUser } from "@/app/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";

const LoginScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()
  const navigation = useNavigation()

  const handleLogin = async () => {
    if (!username || !password) {
      console.log("Login validation failed: missing fields");
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }
  
    try {
      console.log("Attempting login with username:", username);
      setIsSubmitting(true);
  
      const response = await loginUser(username, password);
  
      if (response.success && response.data) {
        console.log("Login successful, saving token and role");
  
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        await AsyncStorage.setItem('role', response.data.role);
  
        if (rememberMe) {
          await AsyncStorage.setItem("savedUsername", username);
          await AsyncStorage.setItem("rememberMe", "true");
        } else {
          await AsyncStorage.removeItem("savedUsername");
          await AsyncStorage.removeItem("rememberMe");
        }
  
        await login(response.data.accessToken, response.data.role);
      
        navigation.reset({
          routes: [{ name: "Main" as never }],
        });
      } else {
        Alert.alert("Đăng nhập thất bại", response.message || "Vui lòng kiểm tra thông tin đăng nhập và thử lại");
      }
    } catch (error: any) {
      console.log("Login failed:", error.message);
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi trong quá trình đăng nhập");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.formWrapper}>
          <View style={styles.orangeBorder} />

          <View style={styles.logoContainer}>
            {/* <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" /> */}
            <Image source={require("../../../assets/images/Logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Quản lý vé sự kiện</Text>
            <Text style={styles.subtitle}>Nhập thông tin đăng nhập để truy cập hệ thống</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={18} color="#FF8C00" />
                <Text style={styles.inputLabel}>Tên đăng nhập</Text>
              </View>
              <TextInput
                value={username}
                onChangeText={(text) => {
                  console.log("🔑 Username input changed")
                  setUsername(text)
                }}
                mode="flat"
                style={styles.input}
                placeholder="Nhập tên đăng nhập"
                placeholderTextColor="#6c757d"
                autoCapitalize="none"
                theme={{
                  colors: {
                    primary: "#FF8C00",
                    text: "#FFFFFF",
                    placeholder: "#6c757d",
                    background: "transparent",
                  },
                }}
                underlineColor="transparent"
                activeUnderlineColor="#FF8C00"
                selectionColor="#FF8C00"
                textColor="#FFFFFF"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="#FF8C00" />
                <Text style={styles.inputLabel}>Mật khẩu</Text>
              </View>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  console.log("🔑 Password input changed")
                  setPassword(text)
                }}
                mode="flat"
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#6c757d"
                secureTextEntry={!passwordVisible}
                theme={{
                  colors: {
                    primary: "#FF8C00",
                    text: "#FFFFFF",
                    placeholder: "#6c757d",
                    background: "transparent",
                  },
                }}
                underlineColor="transparent"
                activeUnderlineColor="#FF8C00"
                selectionColor="#FF8C00"
                textColor="#FFFFFF"
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => {
                      console.log("🔑 Password visibility toggled")
                      setPasswordVisible(!passwordVisible)
                    }}
                    color="#6c757d"
                  />
                }
              />
            </View>

            <View style={styles.rememberForgotContainer}>
              <View style={styles.rememberContainer}>
                <Checkbox
                  status={rememberMe ? "checked" : "unchecked"}
                  onPress={() => {
                    console.log("🔑 Remember me toggled:", !rememberMe)
                    setRememberMe(!rememberMe)
                  }}
                  color="#FF8C00"
                  uncheckedColor="#6c757d"
                />
                <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log("🔑 Navigating to forgot password screen")
                  navigation.navigate("ForgotPassword" as never)
                }}
              >
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              disabled={isSubmitting}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              loading={isSubmitting}
              icon={({ size, color }) => <Ionicons name="log-in-outline" size={size} color={color} />}
            >
              Đăng nhập
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("🔑 Navigating to register screen")
                  navigation.navigate("Register" as never)
                }}
              >
                <Text style={styles.footerLink}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.copyright}>© 2025 Event Ticket App. All rights reserved.</Text>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formWrapper: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    overflow: "hidden",
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  orangeBorder: {
    height: 4,
    backgroundColor: "#FF8C00",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#2A2A2A",
    height: 50,
    borderRadius: 5,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    color: "#9E9E9E",
    marginLeft: 4,
  },
  forgotPasswordText: {
    color: "#FF8C00",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#FF8C00",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  footerText: {
    color: "#9E9E9E",
  },
  footerLink: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  copyright: {
    color: "#6c757d",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
})

export default LoginScreen