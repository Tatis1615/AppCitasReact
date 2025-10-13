import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleAdmin({ route, navigation }) {
  const { id } = route.params;
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudo cargar el admin");

        const data = await response.json();
        setAdmin(data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el admin");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  const eliminarAdmin = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar este administrador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarAdmin/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Administrador eliminado correctamente");
                navigation.navigate("ListarAdmin");
              } else {
                console.error("Error del servidor:", data);
                Alert.alert("Error", data.message || "No se pudo eliminar el administrador");
              }
            } catch (error) {
              console.error("Error eliminando admin:", error);
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
        <Text>Cargando admin...</Text>
      </View>
    );
  }

  if (!admin) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>No se encontró información del admin</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Administrador</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de usuario:</Text>
        <Text style={styles.value}>{admin.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{admin.email}</Text>

        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{admin.role}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarAdmin", { admin })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarAdmin}
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
