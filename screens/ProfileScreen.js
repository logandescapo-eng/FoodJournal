import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.username || "Unknown"}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email || "Not provided"}</Text>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.message}>No user is currently signed in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E85D04",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: "#222",
    fontWeight: "600",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  button: {
    marginTop: 32,
    backgroundColor: "#E85D04",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
