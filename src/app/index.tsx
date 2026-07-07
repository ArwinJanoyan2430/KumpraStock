import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

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

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/asd.png")} style={styles.logo} />
        </View>

        <Text style={styles.title}>KumpraStock</Text>

        <Text style={styles.tagline}>Smart Grocery Purchase Tracker</Text>

        <Text style={styles.subtitle}>
          Organize every grocery purchase, monitor expenses, and keep accurate
          records for your sari-sari store—all in one simple app.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => router.push("/pos")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.credit}>Made by Arwin Janoyan</Text>
        <Text style={styles.footer}>KUMPRASTOCK • Version 1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  content: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 250,
    height: 200,
    borderRadius: 80,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 8,
    fontSize: 17,
    color: "#BFDBFE",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: 20,
    color: "#E5F0FF",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 320,
  },

  button: {
    marginTop: 35,
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    elevation: 6,
  },

  buttonText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "700",
  },

  footerContainer: {
    position: "absolute",
    bottom: 25,
    alignItems: "center",
  },

  credit: {
    color: "#DBEAFE",
    fontSize: 14,
  },

  footer: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 2,
  },
});
