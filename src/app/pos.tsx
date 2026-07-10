import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function POS() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [cash, setCash] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState<
    {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[]
  >([]);
  useEffect(() => {
    if (Platform.OS === "web") {
      const navEntries = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];

      if (navEntries[0]?.type === "reload") {
        router.replace("/");
      }
    }
  }, []);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const saved = await AsyncStorage.getItem("products");

        if (saved) {
          setProducts(JSON.parse(saved));
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem("products", JSON.stringify(products));
  }, [products]);
  const saveHistory = async () => {
    const purchase = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      products: products,
      total: total,
      cash: Number(cash),
      change: change,
    };

    try {
      const oldHistory = await AsyncStorage.getItem("history");

      const history = oldHistory ? JSON.parse(oldHistory) : [];

      history.push(purchase);

      await AsyncStorage.setItem("history", JSON.stringify(history));
    } catch (error) {
      console.log(error);
    }
  };
  const removeProduct = (id: string) => {
    setProducts(products.filter((item) => item.id !== id));
  };
  const increaseQuantity = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id: string) => {
    setProducts((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const addProduct = () => {
    const productPrice = Number(price);
    const productQuantity = Number(quantity);

    if (!productName.trim() || !price.trim() || !quantity.trim()) {
      return;
    }

    // Check if price and quantity are valid numbers
    if (
      isNaN(productPrice) ||
      isNaN(productQuantity) ||
      productPrice <= 0 ||
      productQuantity <= 0
    ) {
      return;
    }

    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: productName.trim(),
        price: productPrice,
        quantity: productQuantity,
      },
    ]);

    setProductName("");
    setPrice("");
    setQuantity("");
  };

  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const change = Number(cash) - total;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>KUMPRASTOCK</Text>

        <TouchableOpacity
          style={[
            styles.historyButton,
            products.length > 0 && styles.historyButtonDisabled,
          ]}
          disabled={products.length > 0}
          onPress={() => router.push("/history")}
        >
          <MaterialIcons
            name="history"
            size={25}
            color={products.length > 0 ? "#9CA3AF" : "#2563EB"}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) =>
          setProductName(text.replace(/\b\w/g, (char) => char.toUpperCase()))
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
        />

        <TextInput
          style={[styles.input, styles.quantityInput]}
          placeholder="Qty"
          keyboardType="number-pad"
          value={quantity}
          textAlign="center"
          maxLength={3}
          onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ""))}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Products to Purchase</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No products added.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.product}>{item.name}</Text>

              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => decreaseQuantity(item.id)}
                >
                  <MaterialIcons name="remove" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQuantity(item.id)}
                >
                  <MaterialIcons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: "flex-end", marginRight: 15 }}>
              <Text style={styles.price}>
                ₱{(item.price * item.quantity).toFixed(2)}
              </Text>

              <Text style={{ color: "#6B7280", fontSize: 12 }}>
                ₱{item.price.toFixed(2)} each
              </Text>
            </View>

            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <MaterialIcons
                name="delete"
                size={26}
                style={{ padding: 6, borderRadius: 6 }}
                color="red"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Products: {products.length}
        </Text>

        <Text style={styles.total}>₱{total.toFixed(2)}</Text>
      </View>

      <TextInput
        style={styles.inputCash}
        placeholder="Enter Cash"
        keyboardType="numeric"
        value={cash}
        onChangeText={setCash}
      />

      <TouchableOpacity
        style={[
          styles.payButton,
          (products.length === 0 || Number(cash) < total) && {
            backgroundColor: "#9CA3AF",
          },
        ]}
        disabled={products.length === 0 || Number(cash) < total}
        onPress={() => setShowReceipt(true)}
      >
        <Text style={styles.payText}>
          {Number(cash) >= total ? "PAY" : "NOT ENOUGH CASH"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showReceipt} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>PURCHASE RECEIPT</Text>

            <View style={styles.divider} />

            <Text style={styles.receiptHeading}>Purchased Products</Text>

            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 250 }}
              renderItem={({ item }) => (
                <View style={styles.receiptRow}>
                  <View>
                    <Text style={styles.receiptProduct}>{item.name}</Text>

                    <Text style={{ color: "#6B7280", fontSize: 12 }}>
                      Qty: {item.quantity}
                    </Text>
                  </View>

                  <Text style={styles.receiptPrice}>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              )}
            />

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text>Total Products</Text>
              <Text>{products.length}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Total Amount</Text>
              <Text>₱{total.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Cash</Text>
              <Text>₱{Number(cash).toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Change</Text>
              <Text>₱{change.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowReceipt(false)}
              >
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={async () => {
                  await saveHistory();

                  setProducts([]);
                  await AsyncStorage.removeItem("products");

                  setCash("");
                  setShowReceipt(false);
                }}
              >
                <Text style={styles.doneText}>Done Paying</Text>
              </TouchableOpacity>
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },

  titleRow: {
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

  historyButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    height: 55,
  },
  inputCash: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    height: 55,
    marginBottom: 10,
  },

  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 12,
  },

  priceInput: {
    flex: 1,
  },

  quantityInput: {
    width: 100,
  },

  addButton: {
    backgroundColor: "#2563EB",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  product: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "700",
  },

  summary: {
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  summaryText: {
    color: "#6B7280",
  },

  total: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
  },

  payButton: {
    backgroundColor: "#16A34A",
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  payText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  receiptCard: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },

  receiptTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
  },

  receiptHeading: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  receiptProduct: {
    fontSize: 15,
    color: "#111827",
  },

  receiptPrice: {
    fontSize: 15,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 5,
    gap: 12,
  },

  backButton: {
    width: 60,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#ff2f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 35,
    fontWeight: "600",
    color: "#ffffff",
  },

  doneButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  doneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  qtyButton: {
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: "#8b8b8b",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: "700",
    minWidth: 0,
    textAlign: "center",
  },

  historyButtonDisabled: {
    backgroundColor: "#F3F4F6",
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
});
