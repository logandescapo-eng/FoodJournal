import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { registerUser } from "../db/database";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    else if (form.username.trim().length < 3) errs.username = "Username must be at least 3 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!form.confirm) errs.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await registerUser(form.username.trim(), form.password, form.email.trim().toLowerCase());
    setLoading(false);
    if (result.success) {
      Alert.alert("Success", "Account created! Please log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Registration Failed", result.error);
    }
  };

  const Field = ({ label, field, placeholder, secure, keyboard }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={form[field]}
        onChangeText={(t) => setField(field, t)}
        secureTextEntry={secure}
        keyboardType={keyboard || "default"}
        autoCapitalize={field === "email" ? "none" : "sentences"}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start journaling your meals</Text>
        <Field label="Username" field="username" placeholder="Choose a username" />
        <Field label="Email" field="email" placeholder="Enter your email" keyboard="email-address" />
        <Field label="Password" field="password" placeholder="Choose a password" secure />
        <Field label="Confirm Password" field="confirm" placeholder="Repeat your password" secure />
        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryButtonText}>Create Account</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.link}>Log In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  inner: { flexGrow: 1, justifyContent: "center", padding: 28 },
  title: { fontSize: 32, fontWeight: "800", color: "#E85D04", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center", marginBottom: 30 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16 },
  inputError: { borderColor: "#E85D04" },
  errorText: { color: "#E85D04", fontSize: 12, marginTop: 4 },
  primaryButton: { backgroundColor: "#E85D04", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 10, marginBottom: 20 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  linkText: { textAlign: "center", color: "#888", fontSize: 14 },
  link: { color: "#E85D04", fontWeight: "600" },
});