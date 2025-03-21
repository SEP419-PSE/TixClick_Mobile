import { useState } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Card, Text, TextInput, Title } from "react-native-paper"
import { useAuth } from "../context/AuthContext"

export default function Auth({ onAuthSuccess }:any) {
  const { login, register } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu")
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      onAuthSuccess()
    } catch (error: any) {
      Alert.alert("Lỗi đăng nhập", error.message || "Đăng nhập thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu")
      return
    }

    setLoading(true)
    try {
      await register(username, email, password, firstName, lastName)
      Alert.alert("Đăng ký thành công", "Tài khoản của bạn đã được tạo thành công!")
      setIsLogin(true)
    } catch (error:any) {
      Alert.alert("Lỗi đăng ký", error.message || "Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{isLogin ? "Đăng nhập" : "Đăng ký"}</Title>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={isLogin ? handleLogin : handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  switchContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#6200ee",
  },
})

