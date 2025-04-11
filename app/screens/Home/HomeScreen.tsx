import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Searchbar
} from 'react-native-paper';

export const COLORS = {
  primary: '#FF8C00', // Orange
  primaryDark: '#E67E00',
  secondary: '#2196F3', // Blue
  background: '#121212', // Dark background
  card: '#1E1E1E', // Slightly lighter background for cards
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  inactive: '#757575',
  statusUnused: '#2196F3', // Blue
  statusCheckedIn: '#4CAF50', // Green
  statusCheckedOut: '#9E9E9E', // Grey
};

// Mock data for featured events
const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Summer Music Festival',
    date: '15 Aug 2023',
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: '350,000'
  },
  {
    id: '2',
    title: 'International Food Fair',
    date: '22 Aug 2023',
    location: 'Exhibition Center',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    price: '200,000'
  },
  {
    id: '3',
    title: 'Tech Conference 2023',
    date: '5 Sep 2023',
    location: 'Convention Center',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: '500,000'
  },
];

const CATEGORIES = [
  { id: '1', name: 'Music', icon: 'musical-notes' },
  { id: '2', name: 'Sports', icon: 'football' },
  { id: '3', name: 'Arts', icon: 'color-palette' },
  { id: '5', name: 'Tech', icon: 'laptop' },
];

// Mock data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Jazz Night',
    date: '18 Aug 2023',
    location: 'Blue Note Club',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    price: '250,000'
  },
  {
    id: '2',
    title: 'Basketball Tournament',
    date: '20 Aug 2023',
    location: 'Sports Arena',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    price: '150,000'
  },
  {
    id: '3',
    title: 'Art Exhibition',
    date: '25 Aug 2023',
    location: 'Modern Art Gallery',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: '100,000'
  },
  {
    id: '4',
    title: 'Comedy Night',
    date: '30 Aug 2023',
    location: 'Laugh Factory',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    price: '200,000'
  },
];

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleEventPress = (eventId: string) => {
    console.log(`Navigating to event ${eventId}`);
  };

  const renderFeaturedItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.featuredItem} 
      onPress={() => handleEventPress(item.id)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.featuredImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.featuredGradient}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <View style={styles.featuredDetails}>
              <View style={styles.featuredDetail}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
                <Text style={styles.featuredDetailText}>{item.date}</Text>
              </View>
              <View style={styles.featuredDetail}>
                <Ionicons name="location" size={16} color={COLORS.primary} />
                <Text style={styles.featuredDetailText}>{item.location}</Text>
              </View>
            </View>
            <Text style={styles.featuredPrice}>{item.price} VND</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected
      ]} 
      onPress={() => handleCategoryPress(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={24} 
        color={selectedCategory === item.id ? COLORS.text : COLORS.primary} 
      />
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderUpcomingItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.upcomingItem} 
      onPress={() => handleEventPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.upcomingImage} />
      <View style={styles.upcomingContent}>
        <Text style={styles.upcomingTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.upcomingDetail}>
          <Ionicons name="calendar" size={14} color={COLORS.primary} />
          <Text style={styles.upcomingDetailText}>{item.date}</Text>
        </View>
        <View style={styles.upcomingDetail}>
          <Ionicons name="location" size={14} color={COLORS.primary} />
          <Text style={styles.upcomingDetailText} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={styles.upcomingPrice}>{item.price} VND</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.subGreeting}>Find your next event</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search events"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={COLORS.primary}
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Featured Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={FEATURED_EVENTS}
          renderItem={renderFeaturedItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          snapToInterval={width - 60}
          decelerationRate="fast"
        />

        {/* Upcoming Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.upcomingList}>
          {UPCOMING_EVENTS.map(item => renderUpcomingItem({ item }))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    elevation: 0,
  },
  searchInput: {
    color: COLORS.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.text,
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredItem: {
    width: width - 60,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  featuredGradient: {
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  featuredDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featuredDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredDetailText: {
    color: COLORS.text,
    marginLeft: 4,
    fontSize: 14,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  upcomingList: {
    paddingHorizontal: 16,
  },
  upcomingItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  upcomingImage: {
    width: 100,
    height: 100,
  },
  upcomingContent: {
    flex: 1,
    padding: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  upcomingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  upcomingDetailText: {
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontSize: 12,
  },
  upcomingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
});

export default HomeScreen;