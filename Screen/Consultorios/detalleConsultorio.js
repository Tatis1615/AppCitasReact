import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleConsultorio({ route, navigation }) {
  const { id } = route.params;
  const [consultorio, setConsultorio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultorio = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/consultorios/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudo cargar el consultorio");

        const data = await response.json();
        setConsultorio(data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el consultorio");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorio();
  }, [id]);

  const eliminarConsultorio = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar este consultorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarConsultorio/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Consultorio eliminado correctamente");
                navigation.navigate("ListarConsultorios");
              } else {
                console.error("Error del servidor:", data);
                Alert.alert("Error", data.message || "No se pudo eliminar el consultorio");
              }
            } catch (error) {
              console.error("Error eliminando consultorio:", error);
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
        <Text>Cargando consultorio...</Text>
      </View>
    );
  }

  if (!consultorio) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>No se encontró información del consultorio</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del consultorio</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Número:</Text>
        <Text style={styles.value}>{consultorio.numero}</Text>

        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{consultorio.ubicacion}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarConsultorio", { consultorio })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarConsultorio}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>Eliminar</Text>
      </TouchableOpacity>


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
