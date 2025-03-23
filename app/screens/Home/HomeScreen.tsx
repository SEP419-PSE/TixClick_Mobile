
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native"
import { Card, Title, Paragraph } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { fetchEvents } from "@/app/lib/api"

type Event = {
  id: string
  title: string
  date: string
  location: string
  imageUrl: string
  description: string
}

const HomeScreen = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await fetchEvents()
      setEvents(data)
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadEvents()
    setRefreshing(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.imageUrl }} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.date}</Paragraph>
          <Paragraph>{item.location}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>

      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{loading ? "Loading events..." : "No upcoming events found"}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})

export default HomeScreen

