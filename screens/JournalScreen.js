import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAllEntries } from "../db/database";
import { useAuth } from "../context/AuthContext";

export default function JournalScreen({ navigation }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    const data = await getAllEntries(user.id);
    setEntries(data);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EntryDetail", { entry: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Food Journal</Text>
        <Text style={styles.headerSub}>{entries.length} {entries.length === 1 ? "entry" : "entries"}</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽</Text>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptySub}>Tap the Add tab to capture your first meal!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85D04" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  headerSub: { fontSize: 14, color: "#888", marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardImage: { width: "100%", height: 200 },
  cardBody: { padding: 14 },
  cardDescription: { fontSize: 15, color: "#222", lineHeight: 21, marginBottom: 8 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardCategory: {
    backgroundColor: "#FFF0E6", color: "#E85D04",
    fontSize: 12, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  cardDate: { fontSize: 12, color: "#aaa" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 8 },
  emptySub: { fontSize: 15, color: "#888", textAlign: "center" },
});