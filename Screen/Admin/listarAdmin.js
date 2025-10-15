import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config"; 

export default function ListarAdmin({ navigation }) {
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/listarAdmin`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setAdmin(data);
        } else {
          console.log("Error al obtener admin:", data);
        }
      } catch (error) {
        console.error("Error en fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text style={{ marginTop: 10, color: "#e38ea8" }}>Cargando administradores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Administradores</Text>

      <FlatList
        data={admin}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleAdmin", { id: item.id })}
          >
            <View style={styles.cardContent}>
              <Ionicons
                name="person-circle-outline"
                size={40}
                color="#e38ea8"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="mail-outline" size={16} color="#888" style={{ marginRight: 4 }} />
                  <Text style={styles.cardSubtitle}>{item.email}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No tienes administradores registrados.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearAdmin")}
      >
        <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>Crear Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff0f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff0f5",
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#e38ea8",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f7b2c4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    padding: 15,
    marginVertical: 6,
    backgroundColor: "#ffe6f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  cardSubtitle: {
    color: "#555",
    marginTop: 3,
  },
});
