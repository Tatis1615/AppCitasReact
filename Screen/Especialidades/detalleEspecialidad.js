import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";
import API_BASE_URL from "../../Src/Config";

export default function DetalleEspecialidad({ route, navigation }) {
  const { id } = route.params;
  const [ especialidad, setEspecialidad ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEspecialidad = async () => {
      try {
        const response = await fetchWithAuth(`/especialidades/${id}`, { method: "GET" });
        const raw = await response.text();
        if (!response.ok) {
          console.log("DetalleEspecialidad error:", {
            status: response.status,
            statusText: response.statusText,
            body: raw,
          });
          throw new Error("No se pudo cargar la especialidad");
        }
        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.log("DetalleEspecialidad JSON parse error:", e, raw);
          throw new Error("Respuesta inválida del servidor");
        }
        // Acepta objeto directo o envuelto
        setEspecialidad(data?.data ?? data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar la especialidad");
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialidad();
  }, [id]);

  const eliminarEspecialidad = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar esta especialidad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarEspecialidad/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Especialidad eliminado correctamente");
                navigation.navigate("ListarEspecialidades"); 
              } else {
                console.error("Error del servidor:", data);
                Alert.alert("Error", data.message || "No se pudo eliminar la especialidad");
              }
            } catch (error) {
              console.error("Error eliminando especialidad:", error);
              Alert.alert("Error de conexión con el servidor");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text>Cargando especialidad...</Text>
      </View>
    );
  }
  if (!especialidad) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}> No se encontró información de la especialidad</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Especialidad</Text>
      <View style={styles.card}>
  <Text style={styles.label}>Nombre:</Text>
  <Text style={styles.value}>{especialidad?.nombre_e || "Sin nombre"}</Text>
      </View>

      {/* Botón Editar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarEspecialidad", { especialidad })}
        disabled={!especialidad}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarEspecialidad}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>Eliminar</Text>
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
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
    marginBottom: 20,
    fontWeight: "bold",
    color: "#e38ea8",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffe6f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#f7b2c4",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cc3366",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#d67693ff",
  },
});