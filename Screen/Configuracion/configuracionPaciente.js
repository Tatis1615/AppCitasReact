import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ConfiguracionPaciente() {
  const [citas, setCitas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarCitasPaciente();
  }, []);

  const cargarCitasPaciente = async () => {
    try {
      const res = await fetchWithAuth(`/listarCitasPaciente`, { method: "GET" });
      const json = await res.json();
      if (res.ok && json.success) {
        setCitas(json.data ?? []);
      } else {
        Alert.alert("Aviso", "No se pudieron obtener tus citas.");
      }
    } catch (error) {
      console.error("Error cargando citas del paciente:", error);
    }
  };

  const programarNotificacion = async (cita) => {
    try {
      const fechaCita = new Date(cita.fecha_hora);
      const ahora = new Date();

      const fechaNotificacion = new Date(fechaCita);
      fechaNotificacion.setDate(fechaCita.getDate() - 1);

      if (fechaNotificacion <= ahora) {
        Alert.alert("No se puede programar", "La cita ya está muy próxima o ya pasó.");
        return;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Recordatorio de cita médica",
          body: `Tienes una cita el ${fechaCita.toLocaleString()}.`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: fechaNotificacion,
      });

      setNotificaciones((prev) => [...prev, id]);
      Alert.alert("Notificación programada", "Se te recordará esta cita un día antes.");
    } catch (error) {
      console.error("Error al programar notificación:", error);
    }
  };

  const cancelarNotificaciones = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificaciones([]);
      Alert.alert("Listo", "Todas las notificaciones fueron canceladas.");
    } catch (error) {
      console.error("Error cancelando notificaciones:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={26} color="#f58eb0" />
        <Text style={styles.title}>Configuración del Paciente</Text>
      </View>

      <TouchableOpacity style={styles.reloadBtn} onPress={cargarCitasPaciente}>
        <MaterialIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.reloadTxt}>Actualizar citas</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recordatorios de citas</Text>

      {citas.length === 0 ? (
        <Text style={styles.empty}>No tienes citas programadas actualmente</Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#f58eb0" />
                <Text style={styles.cardTitle}>Cita programada</Text>
              </View>
              <Text style={styles.cardText}>Fecha: {item.fecha_hora}</Text>
              <Text style={styles.cardText}>
                Médico:{" "}
                {item.medicos?.nombre_m ?? item.medico?.nombre_m ?? "Médico"}{" "}
                {item.medicos?.apellido_m ?? item.medico?.apellido_m ?? ""}
              </Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => programarNotificacion(item)}
              >
                <Ionicons name="notifications-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Recordar esta cita</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {notificaciones.length > 0 && (
        <TouchableOpacity style={styles.cancelBtn} onPress={cancelarNotificaciones}>
          <MaterialIcons name="cancel" size={20} color="#fff" />
          <Text style={styles.cancelTxt}>Cancelar todas las notificaciones</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f5", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f58eb0",
    marginLeft: 8,
  },
  reloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f58eb0",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    gap: 5,
  },
  reloadTxt: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginTop: 20,
    marginBottom: 10,
  },
  empty: { textAlign: "center", color: "#777", marginTop: 20 },
  card: {
    backgroundColor: "#ffe6f0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontWeight: "bold", color: "#f58eb0", marginLeft: 6 },
  cardText: { color: "#333", marginBottom: 4 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#faa3c0ff",
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    gap: 6,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d66f91",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 6,
  },
  cancelTxt: { color: "#fff", fontWeight: "bold" },
});
