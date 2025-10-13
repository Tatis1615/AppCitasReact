import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config"; 

export default function ListarConsultorios({ navigation }) {
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/listarConsultorios`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setConsultorios(data);
        } else {
          console.log("Error al obtener consultorio:", data);
        }
      } catch (error) {
        console.error("Error en fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorios();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text style={{ marginTop: 10, color: "#e38ea8 " }}>Cargando consultorios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Consultorios</Text>

      <FlatList
        data={consultorios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleConsultorio", { id: item.id })}
          >
            <Text style={styles.cardTitle}>Consultorio N° {item.numero}</Text>
            <Text style={styles.cardSubtitle}>Ubicación: {item.ubicacion}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No tienes citas registradas.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearConsultorio")}
      >
        <Text style={styles.buttonText}>+ Crear Consultorio</Text>
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
