import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  useEffect(() => {
    loadHistory();
  }, []);

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;

    const updatedHistory = history.filter(
      (item) => item.id !== selectedDeleteId,
    );

    setHistory(updatedHistory);

    await AsyncStorage.setItem(
      "history",
      JSON.stringify([...updatedHistory].reverse()),
    );

    setDeleteModalVisible(false);
    setSelectedDeleteId(null);

    setShowTransaction(false);
    setSelectedTransaction(null);
  };

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("history");

      if (data) {
        setHistory(JSON.parse(data).reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalSpent = history.reduce((sum, item) => sum + item.total, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PURCHASE HISTORY</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/pos")}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Purchases</Text>
          <Text style={styles.summaryValue}>{history.length}</Text>
        </View>

        <View>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>₱{totalSpent.toFixed(2)}</Text>
        </View>
      </View>

      {/* Purchase List */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No purchase history yet.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.date}>{item.date}</Text>

                <Text style={styles.productCount}>
                  {item.products.length} Products
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>PURCHASE</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>

                <Text style={styles.totalAmount}>₱{item.total.toFixed(2)}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    setSelectedTransaction(item);
                    setShowTransaction(true);
                  }}
                >
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setSelectedDeleteId(item.id);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          </TouchableOpacity>
        )}
      />
      <Modal visible={showTransaction} transparent animationType="none">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Transaction Details</Text>

            <Text style={styles.modalDate}>{selectedTransaction?.date}</Text>

            <View style={styles.divider} />

            <FlatList
              data={selectedTransaction?.products || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.receiptRow}>
                  <Text>{item.name}</Text>

                  <Text>₱{item.price.toFixed(2)}</Text>
                </View>
              )}
            />

            <View style={styles.divider} />

            <Text style={styles.modalSummary}>
              Total Products: {selectedTransaction?.products.length}
            </Text>

            <Text style={styles.modalSummary}>
              Total: ₱{selectedTransaction?.total?.toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTransaction(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.warningBanner}>
              <Text style={styles.warningBannerText}>⚠ WARNING</Text>
            </View>

            <View style={styles.deleteContent}>
              <Text style={styles.deleteTitle}>Delete Transaction?</Text>

              <Text style={styles.deleteMessage}>
                This transaction will be permanently removed from your purchase
                history. This action cannot be undone.
              </Text>

              <View style={styles.deleteButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setDeleteModalVisible(false);
                    setSelectedDeleteId(null);
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmDeleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
    padding: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#2563EB", // Blue background
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,

    marginBottom: 10,

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  backIcon: {
    fontSize: 45,
    color: "#2563EB",
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "white",
  },

  summaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    padding: 22,
    marginBottom: 25,

    flexDirection: "row",
    justifyContent: "space-between",

    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  summaryLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },

  summaryValue: {
    marginTop: 5,
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },

  badgeText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 11,
  },

  date: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  productCount: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 18,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#64748B",
    fontSize: 15,
  },

  totalAmount: {
    color: "#16A34A",
    fontSize: 26,
    fontWeight: "900",
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    fontSize: 16,
    color: "#94A3B8",
  },
  actions: {
    flexDirection: "row",
    marginTop: 18,
  },

  viewButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  viewText: {
    color: "#FFF",
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2563EB",
    textAlign: "center",
  },

  modalDate: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 5,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  modalSummary: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  closeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
  },

  deleteMessage: {
    marginTop: 12,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 23,
    fontSize: 15,
  },

  deleteButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 28,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 16,
  },

  confirmDeleteText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  deleteModal: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 22,
    overflow: "hidden", // important
  },

  warningBanner: {
    backgroundColor: "#DC2626",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },

  warningBannerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },

  deleteContent: {
    padding: 25,
    alignItems: "center",
  },
});
