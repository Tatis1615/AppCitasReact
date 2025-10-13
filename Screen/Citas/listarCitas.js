import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitas({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/listarCitas`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCitas(data);
        } else {
          console.log("Error al obtener citas:", data);
        }
      } catch (error) {
        console.error("Error en fetchCitas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Citas</Text>

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleCita", { id: item.id })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={28} color="#e38ea8" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.fecha_hora}</Text>
              <Text style={styles.cardSubtitle}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#999" />{" "}
                Estado: <Text style={styles.estado}>{item.estado}</Text>
              </Text>
            </View>

            <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
          </TouchableOpacity>
        )}
      />


      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearCita")}
      >
        <Text style={styles.buttonText}>+ Crear Cita</Text>
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
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffe6f1ff",
  padding: 15,
  marginVertical: 8,
  marginHorizontal: 2,
  borderRadius: 18,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

iconContainer: {
  borderRadius: 50,
  padding: 8,
  marginRight: 12,
},

cardTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 4,
},

cardSubtitle: {
  fontSize: 14,
  color: "#555",
  flexDirection: "row",
  alignItems: "center",
},

estado: {
  fontWeight: "600",
  color: "#e38ea8",
},

});
