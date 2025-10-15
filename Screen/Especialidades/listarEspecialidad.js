import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchWithAuth } from "../../Src/api";

export default function ListarEspecialidades({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

    const obtenerIconoEspecialidad = (nombre) => {
      const nombreLower = nombre.toLowerCase();
      if (nombreLower.includes("cardio")) return "heart-outline";
      if (nombreLower.includes("pedi")) return "happy-outline";
      if (nombreLower.includes("derma")) return "bandage-outline";
      if (nombreLower.includes("odont") || nombreLower.includes("dental")) return "medkit-outline";
      if (nombreLower.includes("psico")) return "brain-outline";
      if (nombreLower.includes("gine")) return "female-outline";
      if (nombreLower.includes("trauma")) return "body-outline";
      if (nombreLower.includes("neuro")) return "pulse-outline";
      return "medkit-outline";
    };

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetchWithAuth(`/especialidades`, { method: "GET" });
        const data = await response.json();

        if (response.ok) {
          setEspecialidades(data);
        } else {
          console.log("Error al obtener especialidades:", data);
        }
      } catch (error) {
        console.error("Error en fetchEspecialidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialidades();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text style={{ marginTop: 10, color: "#e38ea8" }}>Cargando especialidades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Especialidades</Text>

      <FlatList
        data={especialidades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
          onPress={() => navigation.navigate("DetalleEspecialidad", { id: item.id })}
          >
            <View style={styles.cardContent}>
              <Ionicons
                name={obtenerIconoEspecialidad(item.nombre_e)}
                size={26}
                color="#e38ea8"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.cardTitle}>{item.nombre_e}</Text>
            </View>
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
        onPress={() => navigation.navigate("CrearEspecialidad")}
      >
        <Text style={styles.buttonText}>+ Crear Especialidad</Text>
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
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});

