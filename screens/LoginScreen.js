import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { loginUser } from "../db/database";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = "Username is required";
    if (!password.trim()) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await loginUser(username.trim(), password);
    setLoading(false);
    if (result.success) {
      login(result.user);
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🍽 Food Journal</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Enter username"
            value={username}
            onChangeText={(t) => { setUsername(t); setErrors((e) => ({ ...e, username: null })); }}
            autoCapitalize="none"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Enter password"
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>Log In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  inner: { flexGrow: 1, justifyContent: "center", padding: 28 },
  title: { fontSize: 36, fontWeight: "800", color: "#E85D04", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center", marginBottom: 36 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#ddd",
    borderRadius: 12, padding: 14, fontSize: 16,
  },
  inputError: { borderColor: "#E85D04" },
  errorText: { color: "#E85D04", fontSize: 12, marginTop: 4 },
  primaryButton: {
    backgroundColor: "#E85D04", borderRadius: 12, padding: 16,
    alignItems: "center", marginTop: 10, marginBottom: 20,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  linkText: { textAlign: "center", color: "#888", fontSize: 14 },
  link: { color: "#E85D04", fontWeight: "600" },
});