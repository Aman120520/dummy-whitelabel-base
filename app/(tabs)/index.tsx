import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';

export default function HomeScreen() {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Replace this with dynamic ID from your app's login/storage
  const organizationId = "4565";

  const fetchAppConfiguration = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);

      const apiUrl = `https://configs.quickdrycleaning.com/api/configuration/${organizationId}`;
      const response = await fetch(apiUrl);

      // 1. Check if the server returned a success status (200-299)
      if (!response.ok) {
        throw new Error(`Server rejected request. Status: ${response.status} ${response.statusText}. Check if the URL is correct or if the server is down.`);
      }

      // 2. Read the response as raw text first
      const textResponse = await response.text();
      let data;

      // 3. Attempt to parse the text as JSON
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error("API returned text instead of JSON. First 100 chars:", textResponse.substring(0, 100));
        throw new Error("API did not return valid JSON data.");
      }

      // 4. Set the theme using the successfully parsed data
      setTheme({
        appName: data.appName || 'Default Laundry App',
        primaryColor: data.primaryColor || '#202f66',
        secondaryColor: data.secondaryColor || '#f0f4f8',
        textColor: data.textColor || '#0f172a',
        subTextColor: data.subTextColor || '#475569',
        headerTextColor: data.headerTextColor || '#ffffff',
        buttonText: data.buttonText || 'Schedule Pickup',
        buttonTextColor: data.buttonTextColor || '#ffffff',
        subtitleText: data.subtitleText || 'Swipe down to refresh the latest configurator changes!',
        logoUrl: data.logoUrl || data.assets?.logoUrl || 'https://raw.githubusercontent.com/expo/expo/main/templates/expo-template-blank/assets/icon.png',
        borderRadius: data.borderRadius !== undefined ? data.borderRadius : 24
      });

    } catch (error) {
      console.error("Theme Load Error:", error.message);

      // FALLBACK: Load default theme if the API fails
      setTheme({
        appName: "Tayyar24 Laundry (Fallback)",
        primaryColor: "#202f66",
        secondaryColor: "#f0f4f8",
        textColor: "#0f172a",
        subTextColor: "#475569",
        headerTextColor: "#ffffff",
        buttonText: "Schedule Pickup",
        buttonTextColor: "#ffffff",
        subtitleText: "Could not connect to Configurator. Loading default theme.",
        logoUrl: "https://raw.githubusercontent.com/expo/expo/main/templates/expo-template-blank/assets/icon.png",
        borderRadius: 24
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppConfiguration();
  }, []);

  const onRefresh = useCallback(() => {
    fetchAppConfiguration(true);
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: '#ffffff' }]}>
        <ActivityIndicator size="large" color="#202f66" />
        <Text style={{ marginTop: 12, fontSize: 16, color: '#6c757d' }}>
          Loading App Experience...
        </Text>
      </View>
    );
  }

  if (!theme) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.secondaryColor }]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primaryColor]}
          tintColor={theme.primaryColor}
        />
      }
    >
      {/* Dynamic Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: theme.primaryColor,
          borderBottomLeftRadius: theme.borderRadius * 1.5,
          borderBottomRightRadius: theme.borderRadius * 1.5,
        }
      ]}>
        <Text style={[styles.headerText, { color: theme.headerTextColor }]}>
          {theme.appName}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Dynamic Logo */}
        <Image
          source={{ uri: theme.logoUrl }}
          style={[styles.logo, { borderRadius: theme.borderRadius }]}
          resizeMode="contain"
        />

        {/* Dynamic Texts */}
        <Text style={[styles.title, { color: theme.textColor }]}>
          {theme.appName}
        </Text>

        <Text style={[styles.subtitle, { color: theme.subTextColor }]}>
          {theme.subtitleText}
        </Text>

        {/* Dynamic Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.primaryColor,
              borderRadius: theme.borderRadius
            }
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>
            {theme.buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 32,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});