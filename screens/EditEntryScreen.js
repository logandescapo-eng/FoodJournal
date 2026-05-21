import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, SafeAreaView, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { updateJournalEntry } from "../db/database";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink", "Other"];

export default function EditEntryScreen({ route, navigation }) {
  const { entry } = route.params;
  const [description, setDescription] = useState(entry.description);
  const [category, setCategory] = useState(entry.category);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert("Missing description", "Please enter a description.");
      return;
    }
    setSaving(true);
    const result = await updateJournalEntry(entry.id, description.trim(), category);
    setSaving(false);
    if (result.success) {
      Alert.alert("Updated", "Your entry has been updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Entry</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Describe your meal..."
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  inner: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  backText: { color: "#E85D04", fontSize: 16, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "800", color: "#1a1a1a" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  textArea: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5,
    borderColor: "#ddd", padding: 14, fontSize: 15, minHeight: 120, marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5,
    borderColor: "#ddd", marginBottom: 28, overflow: "hidden",
  },
  saveButton: { backgroundColor: "#E85D04", borderRadius: 14, padding: 18, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});