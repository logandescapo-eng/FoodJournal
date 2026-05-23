import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, Alert, SafeAreaView, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { addJournalEntry } from "../db/database";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink", "Other"];

const pickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.7,
};

export default function AddEntryScreen({ navigation }) {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lunch");
  const [saving, setSaving] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const applyPickedImage = (result) => {
    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    try {
      setCameraLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera permission needed",
          "Enable camera access for Expo Go in your phone Settings, then try again."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync(pickerOptions);
      applyPickedImage(result);
    } catch (err) {
      const message = err?.message || String(err);
      if (message.toLowerCase().includes("camera") || message.toLowerCase().includes("unavailable")) {
        Alert.alert(
          "Camera not available",
          "This device or emulator has no camera. Use \"Choose from Library\" or test on a physical phone."
        );
      } else {
        Alert.alert("Camera error", message);
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Photos permission needed",
          "Enable photo library access for Expo Go in your phone Settings, then try again."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
      applyPickedImage(result);
    } catch (err) {
      Alert.alert("Gallery error", err?.message || "Could not open your photo library.");
    }
  };

  const handleSave = async () => {
    if (!imageUri) { Alert.alert("No image", "Please take or select a photo first."); return; }
    if (!description.trim()) { Alert.alert("Missing description", "Please add a description."); return; }
    setSaving(true);
    const result = await addJournalEntry(user.id, imageUri, description.trim(), category);
    setSaving(false);
    if (result.success) {
      setImageUri(null);
      setDescription("");
      setCategory("Lunch");
      Alert.alert("Saved!", "Your meal has been added to the journal.", [
        { text: "OK", onPress: () => navigation.navigate("Journal") },
      ]);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const reset = () => setImageUri(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Meal</Text>

        {imageUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <TouchableOpacity style={styles.retakeBtn} onPress={reset}>
              <Text style={styles.retakeBtnText}>Retake / Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={openCamera}
                disabled={cameraLoading}
              >
                {cameraLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.imageBtnText}>Take Photo</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.imageBtn, styles.imageBtnSecondary]} onPress={pickFromLibrary}>
                <Text style={[styles.imageBtnText, styles.imageBtnTextSecondary]}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="What did you eat? How did it taste?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
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
            : <Text style={styles.saveButtonText}>Done</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a1a1a", marginBottom: 20 },
  imageWrapper: { marginBottom: 20, borderRadius: 16, overflow: "hidden" },
  preview: { width: "100%", height: 240, borderRadius: 16 },
  retakeBtn: { backgroundColor: "rgba(0,0,0,0.6)", padding: 10, alignItems: "center" },
  retakeBtnText: { color: "#fff", fontWeight: "600" },
  imagePlaceholder: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 2,
    borderColor: "#f0d0c0", borderStyle: "dashed",
    height: 200, justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  placeholderIcon: { fontSize: 48, marginBottom: 14 },
  imageButtons: { flexDirection: "row", gap: 10 },
  imageBtn: {
    backgroundColor: "#E85D04", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16,
    minWidth: 120, alignItems: "center",
  },
  imageBtnSecondary: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E85D04" },
  imageBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  imageBtnTextSecondary: { color: "#E85D04" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  textArea: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5, borderColor: "#ddd",
    padding: 14, fontSize: 15, minHeight: 100, marginBottom: 18,
  },
  pickerContainer: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5, borderColor: "#ddd",
    marginBottom: 28, overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#E85D04", borderRadius: 14, padding: 18, alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
