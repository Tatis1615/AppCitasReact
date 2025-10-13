import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleCitaPaciente({ route, navigation }) {
  const params = route.params || {};
  const idFromParams = params.id ?? params.cita?.id ?? params.cita_id ?? null;
  const [citaId] = useState(Number(idFromParams)); 

  const { cita } = params;
  const [medico, setMedico] = useState(null);
  const [consultorio, setConsultorioNumero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (cita?.medico_id) {
          const res = await fetch(`${API_BASE_URL}/medicos/${cita.medico_id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (res.ok) setMedico(await res.json());
        }
        if (cita.consultorios) {
          setConsultorioNumero(cita.consultorios.numero ?? "No disponible");
        }
      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [cita]);

  const eliminarCitaPaciente = async () => {
    if (!citaId || isNaN(citaId)) {
      Alert.alert("Error", "ID de cita inválido. No se puede eliminar.");
      console.log("ID inválido recibido en DetalleCitaPaciente:", route.params);
      return;
    }

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const url = `${API_BASE_URL}/eliminarCita/${citaId}`;
              console.log("DELETE ->", url);

              const response = await fetch(url, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              let serverBody = {};
              try {
                const text = await response.text();
                serverBody = text ? JSON.parse(text) : {};
              } catch (err) {
                console.warn("Respuesta no JSON al eliminar cita:", err);
                serverBody = { message: await response.text() };
              }

              console.log("Respuesta eliminarCita:", response.status, serverBody);

              if (response.ok) {
                Alert.alert("Cita eliminada correctamente");
                navigation.navigate("ListarCitasPaciente");
              } else {
                const msg = serverBody?.message || "No se pudo eliminar la cita";
                Alert.alert("Error", msg);
              }
            } catch (error) {
              console.error("Error eliminando cita:", error);
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
        <Text>Cargando cita...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Médico:</Text>
        <Text style={styles.value}>
          {medico ? `${medico.nombre_m} ${medico.apellido_m}` : "No disponible"}
        </Text>

        <Text style={styles.label}>Consultorio:</Text>
        <Text style={styles.value}>{consultorio || "No disponible"}</Text>

        <Text style={styles.label}>Fecha y hora:</Text>
        <Text style={styles.value}>{cita?.fecha_hora ?? "No disponible"}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{cita?.estado ?? "No disponible"}</Text>

        <Text style={styles.label}>Motivo:</Text>
        <Text style={styles.value}>{cita?.motivo ?? "No disponible"}</Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={eliminarCitaPaciente}>
        <Text style={[styles.buttonText, { color: "white" }]}>Eliminar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff0f5" },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold", color: "#e38ea8", textAlign: "center" },
  card: { backgroundColor: "#ffe6f0", padding: 15, borderRadius: 15, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#444" },
  value: { fontSize: 16, marginBottom: 10, color: "#333" },
  button: { backgroundColor: "#f7b2c4", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  cancelButton: { backgroundColor: "white", borderWidth: 1, borderColor: "#cc3366" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  deleteButton: { backgroundColor: "#d67693ff" },
});
