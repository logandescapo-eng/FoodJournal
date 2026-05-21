import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCategories, getEntriesByCategory } from "../db/database";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = {
  Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍎",
  Dessert: "🍰", Drink: "🥤", Other: "🍽", Uncategorised: "📂",
};

export default function CategoriesScreen({ navigation }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadCategories = async () => {
        const cats = await getCategories(user.id);
        const withCounts = await Promise.all(
          cats.map(async ({ category }) => {
            const entries = await getEntriesByCategory(user.id, category);
            return { category, count: entries.length };
          })
        );
        setCategories(withCounts);
      };
      loadCategories();
    }, [user.id])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>
      {categories.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🗂</Text>
          <Text style={styles.emptyText}>No categories yet. Add some meals first!</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.category}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("CategoryDetail", { category: item.category })}
            >
              <Text style={styles.cardIcon}>{CATEGORY_ICONS[item.category] || "🍽"}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.category}</Text>
                <Text style={styles.cardCount}>{item.count} {item.count === 1 ? "meal" : "meals"}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#1a1a1a" },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardIcon: { fontSize: 32, marginRight: 14 },
  cardBody: { flex: 1 },
  cardName: { fontSize: 17, fontWeight: "700", color: "#1a1a1a" },
  cardCount: { fontSize: 13, color: "#888", marginTop: 2 },
  arrow: { fontSize: 24, color: "#ddd", fontWeight: "300" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 14 },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center" },
});