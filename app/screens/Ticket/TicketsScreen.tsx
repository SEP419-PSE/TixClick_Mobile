import { useAuth } from "@/app/context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Badge, Button, Card, Chip, Searchbar } from "react-native-paper"
import { fetchUserTickets } from "../../lib/api" // Update this path to your actual API file
import { Ionicons } from "@expo/vector-icons"
import { ScrollView } from "react-native-gesture-handler"
import { COLORS } from "@/app/utils/theme"


export interface Ticket {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketType: string
  status: "unused" | "checked_in" | "checked_out"
  qrCode: string
  price?: number
  quantity?: number
}

type RootStackParamList = {
  TicketDetails: { ticket: Ticket };
};

const TicketsScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const navigation = useNavigation<any>()
  const { token } = useAuth()

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await fetchUserTickets(token || "")
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
        return COLORS.statusUnused 
      case "checked_in":
        return COLORS.statusCheckedIn 
      case "checked_out":
        return COLORS.statusCheckedOut 
      default:
        return COLORS.statusUnused
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

  const handleViewDetails = (ticket: Ticket) => {
    navigation.navigate('TicketDetails', { ticket })
  }

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.eventLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus ? ticket.status === filterStatus : true;
    
    return matchesSearch && matchesFilter;
  });

  const renderTicketCard = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => handleViewDetails(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.eventTitle}>{item.eventTitle}</Text>
            <Badge style={{ backgroundColor: getStatusColor(item.status) }}>{getStatusText(item.status)}</Badge>
          </View>

          <View style={styles.ticketInfo}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.eventDate}</Text>
          </View>
          
          <View style={styles.ticketInfo}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.eventLocation}</Text>
          </View>
          
          <View style={styles.ticketInfo}>
            <Ionicons name="ticket-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.ticketType}>{item.ticketType}</Text>
          </View>
          
          {item.price !== undefined && (
            <View style={styles.ticketInfo}>
              <Ionicons name="pricetag-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={styles.ticketPrice}>{item.price.toLocaleString()} VND</Text>
            </View>
          )}
          
          {item.quantity !== undefined && item.quantity > 1 && (
            <View style={styles.ticketInfo}>
              <Ionicons name="layers-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>Quantity: {item.quantity}</Text>
            </View>
          )}

          <View style={styles.cardActions}>
            <Button
              mode="contained"
              onPress={() => handleViewDetails(item)}
              style={styles.viewButton}
              labelStyle={styles.buttonLabel}
              icon="eye-outline"
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
      <Searchbar
        placeholder="Search tickets"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={COLORS.primary}
        placeholderTextColor={COLORS.textSecondary}
      />
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          <Chip 
            selected={filterStatus === null} 
            onPress={() => setFilterStatus(null)}
            style={[styles.chip, filterStatus === null && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === null && styles.selectedChipText]}
          >
            All
          </Chip>
          <Chip 
            selected={filterStatus === 'unused'} 
            onPress={() => setFilterStatus('unused')}
            style={[styles.chip, filterStatus === 'unused' && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === 'unused' && styles.selectedChipText]}
          >
            Not Used
          </Chip>
          <Chip 
            selected={filterStatus === 'checked_in'} 
            onPress={() => setFilterStatus('checked_in')}
            style={[styles.chip, filterStatus === 'checked_in' && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === 'checked_in' && styles.selectedChipText]}
          >
            Checked In
          </Chip>
          <Chip 
            selected={filterStatus === 'checked_out'} 
            onPress={() => setFilterStatus('checked_out')}
            style={[styles.chip, filterStatus === 'checked_out' && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === 'checked_out' && styles.selectedChipText]}
          >
            Checked Out
          </Chip>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredTickets}
        renderItem={renderTicketCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.emptyText}>Loading tickets...</Text>
              </>
            ) : (
              <>
                <Ionicons name="ticket-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No tickets found</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery || filterStatus ? 'Try changing your search or filter' : 'Purchase tickets to see them here'}
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    elevation: 0,
  },
  searchInput: {
    color: COLORS.text,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontSize: 14,
  },
  chipContainer: {
    paddingRight: 16,
  },
  chip: {
    backgroundColor: COLORS.card,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
  },
  selectedChipText: {
    color: COLORS.text,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
    color: COLORS.text,
  },
  ticketInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ticketType: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  cardActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
});

export default TicketsScreen;