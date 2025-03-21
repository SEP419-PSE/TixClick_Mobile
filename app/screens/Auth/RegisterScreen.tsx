
import { useAuth } from "@/app/context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button, TextInput } from "react-native-paper"

const RegisterScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigation = useNavigation()

  const handleRegister = async () => {
    if (!username || !password || !email || !firstName || !lastName) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      setIsSubmitting(true)
      await register(username, email, password, firstName, lastName)
    } catch (error: any) {
      Alert.alert("Đăng ký thất bại", error.message || "Đã xảy ra lỗi trong quá trình đăng ký")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formWrapper}>
            <View style={styles.orangeBorder} />

            <View style={styles.logoContainer}>
              <Image source={require("../../../assets/images/Logo.png")} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Đăng ký tài khoản</Text>
              <Text style={styles.subtitle}>Điền thông tin để tạo tài khoản mới</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons name="person-outline" size={18} color="#FF8C00" />
                  <Text style={styles.inputLabel}>Tên đăng nhập</Text>
                </View>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
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
                  onChangeText={setPassword}
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
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      color="#6c757d"
                    />
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Ionicons name="mail-outline" size={18} color="#FF8C00" />
                  <Text style={styles.inputLabel}>Email</Text>
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  mode="flat"
                  style={styles.input}
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor="#6c757d"
                  keyboardType="email-address"
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

              <View style={styles.nameContainer}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.inputLabel}>Tên</Text>
                  </View>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    mode="flat"
                    style={styles.input}
                    placeholder="Tên"
                    placeholderTextColor="#6c757d"
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

                <View style={[styles.inputContainer, styles.nameInput]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.inputLabel}>Họ</Text>
                  </View>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    mode="flat"
                    style={styles.input}
                    placeholder="Họ"
                    placeholderTextColor="#6c757d"
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
              </View>

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                disabled={isSubmitting}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
                loading={isSubmitting}
                icon={({ size, color }) => <Ionicons name="person-add-outline" size={size} color={color} />}
              >
                Đăng ký
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                  <Text style={styles.footerLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.copyright}>© 2025 Event Ticket App. All rights reserved.</Text>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
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
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 0.48,
  },
  button: {
    backgroundColor: "#FF8C00",
    borderRadius: 5,
    marginTop: 10,
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

export default RegisterScreen

