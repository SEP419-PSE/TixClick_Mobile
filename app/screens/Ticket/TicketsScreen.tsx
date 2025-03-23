"use client"

import { useAuth } from "@/app/context/AuthContext"
import { fetchUserTickets } from "@/app/lib/api"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Badge, Button, Card } from "react-native-paper"


type Ticket = {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketType: string
  status: "unused" | "checked_in" | "checked_out"
  qrCode: string
}

const TicketsScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const { token } = useAuth()

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await fetchUserTickets(token)
      setTickets(data)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadTickets()
    setRefreshing(false)
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unused":
        return "#2196F3" // Blue
      case "checked_in":
        return "#4CAF50" // Green
      case "checked_out":
        return "#9E9E9E" // Grey
      default:
        return "#2196F3"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "unused":
        return "Not Used"
      case "checked_in":
        return "Checked In"
      case "checked_out":
        return "Checked Out"
      default:
        return status
    }
  }

  const renderTicketCard = ({ item }: { item: Ticket }) => (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.eventTitle}>{item.eventTitle}</Text>
            <Badge style={{ backgroundColor: getStatusColor(item.status) }}>{getStatusText(item.status)}</Badge>
          </View>

          <Text style={styles.ticketInfo}>{item.eventDate}</Text>
          <Text style={styles.ticketInfo}>{item.eventLocation}</Text>
          <Text style={styles.ticketType}>{item.ticketType}</Text>

          <View style={styles.cardActions}>
            <Button
              mode="contained"
              
            >
              View Details
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderTicketCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{loading ? "Loading tickets..." : "No tickets found"}</Text>
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
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  ticketInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  ticketType: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  cardActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
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

export default TicketsScreen

