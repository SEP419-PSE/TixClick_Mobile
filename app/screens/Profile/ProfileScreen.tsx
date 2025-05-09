import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

export const COLORS = {
  primary: "#FF8C00", // Orange
  primaryDark: "#E67E00",
  secondary: "#2196F3", // Blue
  background: "#121212", // Dark background
  card: "#1E1E1E", // Slightly lighter background for cards
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  border: "#333333",
  error: "#FF5252",
  success: "#4CAF50",
  warning: "#FFC107",
  inactive: "#757575",
}

const ProfileScreen = () => {
  const { logout, role } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigation = useNavigation()

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              setIsLoggingOut(true)

              // Clear all stored tokens and user data
              await AsyncStorage.multiRemove(["token", "role", "savedUsername", "rememberMe"])

              // Call the logout function from AuthContext
              await logout()

              console.log("Logout successful")

              // Reset navigation to Auth stack
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" as never }],
              })
            } catch (error) {
              console.error("Logout error:", error)
              Alert.alert("Logout Failed", "There was a problem logging out. Please try again.")
            } finally {
              setIsLoggingOut(false)
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>My Profile</Text>
            <Text style={styles.subGreeting}>Manage your account</Text>
          </View>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon
              size={80}
              icon="account"
              style={styles.avatar}
              color={COLORS.text}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            <Text style={styles.username}>User Name</Text>
            <Text style={styles.role}>{role || "User"}</Text>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
        </View>

        <Card style={styles.optionsCard}>
          <Card.Content>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="person" size={20} color={COLORS.text} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Edit Profile</Text>
                <Text style={styles.optionDescription}>Change your personal information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="shield" size={20} color={COLORS.text} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Privacy Settings</Text>
                <Text style={styles.optionDescription}>Manage your privacy preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="help-circle" size={20} color={COLORS.text} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Help & Support</Text>
                <Text style={styles.optionDescription}>Get assistance and support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More</Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Ionicons name="log-out" size={20} color={COLORS.text} />
          <Text style={styles.logoutText}>{isLoggingOut ? "Logging out..." : "Logout"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  optionsCard: {
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  optionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  logoutButtonDisabled: {
    backgroundColor: COLORS.inactive,
    opacity: 0.7,
  },
  logoutText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default ProfileScreen
