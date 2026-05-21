import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import JournalScreen from "./JournalScreen";
import AddEntryScreen from "./AddEntryScreen";
import CategoriesScreen from "./CategoriesScreen";
import CategoryDetailScreen from "./CategoryDetailScreen";
import EntryDetailScreen from "./EntryDetailScreen";
import EditEntryScreen from "./EditEntryScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();
const JournalStack = createNativeStackNavigator();
const CategoryStack = createNativeStackNavigator();

function JournalNavigator() {
  return (
    <JournalStack.Navigator screenOptions={{ headerShown: false }}>
      <JournalStack.Screen name="JournalList" component={JournalScreen} />
      <JournalStack.Screen name="AddEntry" component={AddEntryScreen} />
      <JournalStack.Screen name="EntryDetail" component={EntryDetailScreen} />
      <JournalStack.Screen name="EditEntry" component={EditEntryScreen} />
    </JournalStack.Navigator>
  );
}

function CategoryNavigator() {
  return (
    <CategoryStack.Navigator screenOptions={{ headerShown: false }}>
      <CategoryStack.Screen name="CategoriesList" component={CategoriesScreen} />
      <CategoryStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <CategoryStack.Screen name="EntryDetailFromCat" component={EntryDetailScreen} />
      <CategoryStack.Screen name="EditEntryFromCat" component={EditEntryScreen} />
    </CategoryStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#E85D04",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#f0f0f0", height: 60, paddingBottom: 8 },
        tabBarLabel: ({ color }) => {
          const labels = { Journal: "Journal", Categories: "Categories", Add: "Add", Profile: "Profile" };
          return <Text style={{ color, fontSize: 11, marginTop: -4 }}>{labels[route.name]}</Text>;
        },
        tabBarIcon: ({ color }) => {
          const icons = { Journal: "📖", Categories: "🗂", Add: "➕", Profile: "👤" };
          return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Journal" component={JournalNavigator} />
      <Tab.Screen name="Add" component={AddEntryScreen} />
      <Tab.Screen name="Categories" component={CategoryNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}