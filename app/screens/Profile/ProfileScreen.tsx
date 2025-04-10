import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Card, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { logout, role } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
          <Text style={styles.username}>User Name</Text>
          <Text style={styles.role}>{role || 'User'}</Text>
        </View>
      </Card>

      <Card style={styles.optionsCard}>
        <Card.Content>
          <Button 
            icon="account-edit" 
            mode="outlined" 
            style={styles.optionButton}
          >
            Edit Profile
          </Button>
          
          <Divider style={styles.divider} />
          
          <Button 
            icon="shield-account" 
            mode="outlined" 
            style={styles.optionButton}
          >
            Privacy Settings
          </Button>
          
          <Divider style={styles.divider} />
          
          <Button 
            icon="help-circle" 
            mode="outlined" 
            style={styles.optionButton}
          >
            Help & Support
          </Button>
        </Card.Content>
      </Card>

      <Button 
        icon="logout" 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    backgroundColor: '#FF8C00',
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  optionsCard: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  optionButton: {
    marginVertical: 8,
    borderColor: '#333333',
  },
  divider: {
    backgroundColor: '#333333',
    height: 1,
    marginVertical: 8,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    marginTop: 16,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;