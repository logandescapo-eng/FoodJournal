import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initDatabase } from "./db/database";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainTabs from "./screens/MainTabs";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error("DB init error:", err);
        setDbReady(true); // still show app even if init fails
      });
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E85D04" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});