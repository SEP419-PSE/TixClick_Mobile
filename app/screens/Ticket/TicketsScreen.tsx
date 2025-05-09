import { useAuth } from "@/app/context/AuthContext"
import { COLORS } from "@/app/utils/theme"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { ActivityIndicator, Badge, Button, Card, Chip, Searchbar } from "react-native-paper"
import { fetchUserTickets } from "../../lib/api"

// Define the Ticket interface
export interface Ticket {
  id: string; // Added for FlatList keyExtractor
  eventId: number;
  eventActivityId: number;
  ticketPurchaseId: number;
  eventCategoryId: number;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  timeBuyTicket: string;
  locationName: string;
  location: string;
  price: number;
  seatCode: string;
  ticketType: string;
  qrCode: string;
  zoneName: string;
  quantity: number;
  ishaveSeatmap: boolean;
  logo: string;
  banner: string;
  status: string; // Added for status display
}

type RootStackParamList = {
  TicketDetails: { ticket: Ticket }
}

const TicketsScreen = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const navigation = useNavigation<any>()
  const { token } = useAuth()
  const [sortDirection, setSortDirection] = useState("5") // Default sort direction

  const loadTickets = async (page = 1, refresh = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await fetchUserTickets(token || "", page, sortDirection);
      
      if (response) {
        const newTickets = response.tickets;
        
        // Update pagination info
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        
        // If refreshing or first page, replace tickets
        // Otherwise append to existing tickets
        if (refresh || page === 1) {
          setTickets(newTickets);
        } else {
          setTickets(prevTickets => [...prevTickets, ...newTickets]);
        }
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets(1, true);
    setRefreshing(false);
  }

  const loadMoreTickets = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadTickets(currentPage + 1);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [sortDirection]); // Reload when sort direction changes

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
        return "Chưa sử dụng"
      case "checked_in":
        return "Checked In"
      case "checked_out":
        return "Checked Out"
      default:
        return status
    }
  }

  const handleViewDetails = (ticket: Ticket) => {
    navigation.navigate("TicketDetails", { ticket })
  }

  const onChangeSearch = (query: string) => setSearchQuery(query)

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus ? ticket.status === filterStatus : true

    return matchesSearch && matchesFilter
  })

  const renderTicketCard = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => handleViewDetails(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.eventTitle}>{item.eventName}</Text>
            <Badge style={{ backgroundColor: getStatusColor(item.status) }}>{getStatusText(item.status)}</Badge>
          </View>

          <View style={styles.ticketInfo}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {item.eventDate} {item.eventStartTime && `${item.eventStartTime}`}
            </Text>
          </View>

          <View style={styles.ticketInfo}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Ionicons name="ticket-outline" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.ticketType}>
              {item.ticketType}{item.zoneName ? ` - ${item.zoneName}` : ""}
            </Text>
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
              <Text style={styles.infoText}>Số lượng: {item.quantity}</Text>
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
              Xem chi tiết
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more tickets...</Text>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Tìm kiếm vé ..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={COLORS.primary}
        placeholderTextColor={COLORS.textSecondary}
      />

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Xếp theo:</Text>
          
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          <Chip
            selected={filterStatus === null}
            onPress={() => setFilterStatus(null)}
            style={[styles.chip, filterStatus === null && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === null && styles.selectedChipText]}
          >
            Tất cả
          </Chip>
          <Chip
            selected={filterStatus === "unused"}
            onPress={() => setFilterStatus("unused")}
            style={[styles.chip, filterStatus === "unused" && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === "unused" && styles.selectedChipText]}
          >
            Chưa sử dụng
          </Chip>
          <Chip
            selected={filterStatus === "checked_in"}
            onPress={() => setFilterStatus("checked_in")}
            style={[styles.chip, filterStatus === "checked_in" && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === "checked_in" && styles.selectedChipText]}
          >
            Checked In
          </Chip>
          <Chip
            selected={filterStatus === "checked_out"}
            onPress={() => setFilterStatus("checked_out")}
            style={[styles.chip, filterStatus === "checked_out" && styles.selectedChip]}
            textStyle={[styles.chipText, filterStatus === "checked_out" && styles.selectedChipText]}
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
        onEndReached={loadMoreTickets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
                  {searchQuery || filterStatus
                    ? "Try changing your search or filter"
                    : "Purchase tickets to see them here"}
                </Text>
              </>
            )}
          </View>
        }
      />
      
      {currentPage < totalPages && !loading && filteredTickets.length > 0 && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>
      )}
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontSize: 14,
  },
  sortContainer: {
    flex: 1,
    marginLeft: 16,
  },
  sortOptions: {
    paddingRight: 16,
  },
  sortChip: {
    backgroundColor: COLORS.card,
    marginRight: 8,
    height: 32,
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingMoreText: {
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  paginationInfo: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginTop: 8,
  },
  paginationText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
})

export default TicketsScreen