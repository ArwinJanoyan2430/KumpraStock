import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA Offline Ready"))
        .catch(console.error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.card}>
        <Image
          source={require("../../assets/asd.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>v1.0</Text>
        </View>

        <Text style={styles.title}>KumpraStock</Text>

        <Text style={styles.subtitle}>Smart Grocery Purchase Calculator</Text>

        <Text style={styles.description}>
          Add grocery items, enter their prices and quantities, and instantly
          calculate your total spending to stay within your budget.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push("/pos")}
        >
          <MaterialIcons name="shopping-cart" size={22} color="white" />
          <Text style={styles.primaryText}>Start Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.secondaryText}>Purchase History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>© 2026 Arwin Janoyan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",

    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 12,
        }),
  },

  logo: {
    width: 170,
    height: 170,
  },

  badge: {
    marginTop: 10,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#2563EB",
    fontWeight: "700",
  },

  title: {
    marginTop: 18,
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "700",
  },

  description: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontSize: 15,
  },

  primaryButton: {
    marginTop: 35,
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  primaryText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  secondaryButton: {
    marginTop: 14,
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  secondaryText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 17,
  },

  footer: {
    position: "absolute",
    bottom: 30,
  },

  footerText: {
    color: "#DBEAFE",
    fontSize: 14,
  },
});
