import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getEntriesByCategory } from "../db/database";
import { useAuth } from "../context/AuthContext";

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getEntriesByCategory(user.id, category).then(setEntries);
    }, [user.id, category])
  );

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
        <Text style={styles.count}>{entries.length} {entries.length === 1 ? "meal" : "meals"}</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No entries in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("EntryDetailFromCat", { entry: item })}
            >
              <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardBody}>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  backBtn: { marginBottom: 8 },
  backText: { color: "#E85D04", fontWeight: "600", fontSize: 15 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a1a1a" },
  count: { fontSize: 14, color: "#888", marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, marginBottom: 14, flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardImage: { width: 90, height: 90 },
  cardBody: { flex: 1, padding: 12, justifyContent: "center" },
  cardDesc: { fontSize: 14, color: "#222", lineHeight: 20, marginBottom: 6 },
  cardDate: { fontSize: 12, color: "#aaa" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#888" },
});