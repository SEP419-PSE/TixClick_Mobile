import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native"
import { Button, Card, Divider } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { useAuth } from "@/app/context/AuthContext"
import { checkInTicket, checkOutTicket, fetchTicketDetails } from "@/app/lib/api"

type Ticket = {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  ticketType: string
  ticketPrice: string
  status: "unused" | "checked_in" | "checked_out"
  qrCode: string
  seatInfo?: string
  purchaseDate: string
}

type RouteParams = {
  TicketDetails: {
    ticketId: string
  }
}

const TicketDetailsScreen = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const route = useRoute<RouteProp<RouteParams, "TicketDetails">>()
  const { token } = useAuth()
  const navigation = useNavigation()
  const { ticketId } = route.params

  const loadTicketDetails = async () => {
    try {
      setLoading(true)
      const data = await fetchTicketDetails(ticketId, token)
      setTicket(data)
    } catch (error) {
      console.error("Error loading ticket details:", error)
      Alert.alert("Error", "Failed to load ticket details")
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTicketDetails()
  }, [ticketId])

  const handleCheckIn = async () => {
    if (!ticket) return

    try {
      setProcessing(true)
      await checkInTicket(ticket.id, token)
      Alert.alert("Success", "Ticket checked in successfully")
      loadTicketDetails() // Reload ticket to update status
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to check in ticket")
    } finally {
      setProcessing(false)
    }
  }

  const handleCheckOut = async () => {
    if (!ticket) return

    try {
      setProcessing(true)
      await checkOutTicket(ticket.id, token)
      Alert.alert("Success", "Ticket checked out successfully")
      loadTicketDetails() // Reload ticket to update status
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to check out ticket")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading ticket details...</Text>
      </View>
    )
  }

  if (!ticket) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ticket not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
          <Text style={styles.eventDetails}>
            {ticket.eventDate} • {ticket.eventTime}
          </Text>
          <Text style={styles.eventDetails}>{ticket.eventLocation}</Text>

          <Divider style={styles.divider} />

          <View style={styles.qrContainer}>
            <QRCode value={ticket.qrCode} size={200} backgroundColor="white" color="black" />
          </View>

          <View style={styles.ticketInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ticket Type:</Text>
              <Text style={styles.infoValue}>{ticket.ticketType}</Text>
            </View>

            {ticket.seatInfo && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Seat:</Text>
                <Text style={styles.infoValue}>{ticket.seatInfo}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Price:</Text>
              <Text style={styles.infoValue}>{ticket.ticketPrice}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text
                style={[
                  styles.statusValue,
                  {
                    color:
                      ticket.status === "unused" ? "#2196F3" : ticket.status === "checked_in" ? "#4CAF50" : "#9E9E9E",
                  },
                ]}
              >
                {ticket.status === "unused"
                  ? "Not Used"
                  : ticket.status === "checked_in"
                    ? "Checked In"
                    : "Checked Out"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Purchase Date:</Text>
              <Text style={styles.infoValue}>{ticket.purchaseDate}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        {ticket.status === "unused" && (
          <Button
            mode="contained"
            onPress={handleCheckIn}
            style={styles.actionButton}
            loading={processing}
            disabled={processing}
          >
            Check In
          </Button>
        )}

        {ticket.status === "checked_in" && (
          <Button
            mode="contained"
            onPress={handleCheckOut}
            style={styles.actionButton}
            loading={processing}
            disabled={processing}
          >
            Check Out
          </Button>
        )}

        {ticket.status === "checked_out" && (
          <Text style={styles.completedText}>This ticket has been used and checked out.</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#f44336",
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  ticketInfoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  actionButton: {
    width: "80%",
    paddingVertical: 8,
  },
  completedText: {
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
  },
})

export default TicketDetailsScreen

