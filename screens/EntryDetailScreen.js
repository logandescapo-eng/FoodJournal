import React from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from "react-native";
import { deleteJournalEntry } from "../db/database";

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

  const handleDelete = () => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this journal entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteJournalEntry(entry.id);
          if (result.success) {
            navigation.goBack();
          } else {
            Alert.alert("Error", "Could not delete entry. Please try again.");
          }
        },
      },
    ]);
  };

  const editScreenName = route.name === "EntryDetailFromCat" ? "EditEntryFromCat" : "EditEntry";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(editScreenName, { entry })}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image */}
        <Image source={{ uri: entry.imageUri }} style={styles.image} resizeMode="cover" />

        {/* Info */}
        <View style={styles.body}>
          <View style={styles.meta}>
            <Text style={styles.category}>{entry.category}</Text>
            <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
          </View>
          <Text style={styles.description}>{entry.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 6 },
  backBtnText: { color: "#E85D04", fontSize: 16, fontWeight: "600" },
  headerActions: { flexDirection: "row", gap: 10 },
  editBtn: { backgroundColor: "#FFF0E6", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  editBtnText: { color: "#E85D04", fontWeight: "600" },
  deleteBtn: { backgroundColor: "#FFE8E8", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  deleteBtnText: { color: "#D00", fontWeight: "600" },
  image: { width: "100%", height: 300 },
  body: { padding: 20 },
  meta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  category: {
    backgroundColor: "#FFF0E6", color: "#E85D04",
    fontSize: 13, fontWeight: "600", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  date: { fontSize: 13, color: "#aaa" },
  description: { fontSize: 17, color: "#222", lineHeight: 26 },
});