import { COLORS } from '@/app/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

type Ticket = {
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
};

type RouteParams = {
  ticket: Ticket;
};

const TicketDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { ticket } = route.params;
  const [showQR, setShowQR] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unused": return COLORS.statusUnused;
      case "checked_in": return COLORS.statusCheckedIn;
      case "checked_out": return COLORS.statusCheckedOut;
      default: return COLORS.statusUnused;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unused": return "Chưa sử dụng";
      case "checked_in": return "Checked In";
      case "checked_out": return "Checked Out";
      default: return status;
    }
  };

  const handleShareTicket = async () => {
    try {
      await Share.share({
        message: `Check out my ticket for ${ticket.eventTitle} on ${ticket.eventDate} at ${ticket.eventLocation}!`,
        title: `${ticket.eventTitle} Ticket`,
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket.status) }]}>
        <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{ticket.eventDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{ticket.eventLocation}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="ticket-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{ticket.ticketType}</Text>
          </View>

          {ticket.price !== undefined && (
            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.priceText}>{ticket.price.toLocaleString()} VND</Text>
            </View>
          )}

          {ticket.quantity !== undefined && ticket.quantity > 1 && (
            <View style={styles.detailRow}>
              <Ionicons name="layers-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Số lượng: {ticket.quantity}</Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Vé :</Text>
          <Text style={styles.ticketId}>{ticket.id}</Text>

          <TouchableOpacity
            style={styles.qrContainer}
            onPress={() => setShowQR(true)}
            activeOpacity={0.8}
          >
            <View style={styles.showQrButton}>
              <Ionicons name="qr-code-outline" size={24} color={COLORS.text} />
              <Text style={styles.showQrText}>Hiển thị mã QR</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="share-variant"
          onPress={handleShareTicket}
          style={styles.shareButton}
          labelStyle={styles.buttonLabel}
        >
          Chia sẻ vé
        </Button>

        <Button
          mode="outlined"
          icon="download"
          style={styles.downloadButton}
          labelStyle={[styles.buttonLabel, { color: COLORS.primary }]}
        >
          Tải về
        </Button>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>Thông tin lưu ý</Text>
          <Text style={styles.infoText}>
            Vui lòng kiểm tra kỹ thông tin vé trước khi đến sự kiện. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi qua số điện thoại hoặc email bên dưới.
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.infoTitle}>Cần giúp đỡ?</Text>
          <Button
            mode="text"
            icon="headphones"
            style={styles.helpButton}
            labelStyle={{ color: COLORS.primary }}
          >
            Contact Support
          </Button>
        </Card.Content>
      </Card>

      {/* QR Code Modal */}
      <Modal
        visible={showQR}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setShowQR(false)}
        >
          <View style={styles.modalQRContainer}>
            <QRCode
              value={ticket.qrCode || ticket.id}
              size={300}
              color="black"
              backgroundColor="white"
            />
            <Text style={styles.qrHint}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  qrContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  showQrText: {
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: 8,
  },
  qrHint: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  shareButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: COLORS.primary,
  },
  downloadButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  helpButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalQRContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
});

export default TicketDetailsScreen;
