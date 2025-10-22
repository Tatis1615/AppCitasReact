import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ConfiguracionMedico() {
  const [citas, setCitas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const [vibracionActiva, setVibracionActiva] = useState(true);

  useEffect(() => {
    cargarCitasMedico();
  }, []);

  const cargarCitasMedico = async () => {
    try {
      const res = await fetchWithAuth(`/listarCitasMedico`, { method: "GET" });
      const json = await res.json();
      if (res.ok && json.success) {
        setCitas(json.data ?? []);
      } else {
        Alert.alert("Aviso", "No se pudieron obtener tus citas.");
      }
    } catch (error) {
      console.error("Error cargando citas del medico:", error);
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
          title: "Recordatorio de cita",
          body: `Tienes una cita con ${cita.pacientes?.nombre ?? cita.paciente?.nombre ?? "un paciente"} mañana a las ${fechaCita.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
          sound: sonidoActivo,
          vibrate: vibracionActiva,
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

  const themeStyles = modoOscuro ? darkTheme : lightTheme;

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color={themeStyles.icon.color} />
        <Text style={[styles.title, themeStyles.title]}>Configuración del Médico</Text>
      </View>

      {/* Sección de preferencias */}
      <View style={[styles.card, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Preferencias</Text>

        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="moon-outline" size={22} color={themeStyles.icon.color} />
            <Text style={[styles.optionText, themeStyles.text]}>Modo oscuro</Text>
          </View>
          <Switch
            value={modoOscuro}
            onValueChange={setModoOscuro}
            thumbColor={modoOscuro ? "#f58eb0" : "#fff"}
            trackColor={{ true: "#f7b5cc", false: "#ddd" }}
          />
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="volume-high-outline" size={22} color={themeStyles.icon.color} />
            <Text style={[styles.optionText, themeStyles.text]}>Sonido de notificaciones</Text>
          </View>
          <Switch
            value={sonidoActivo}
            onValueChange={setSonidoActivo}
            thumbColor={sonidoActivo ? "#f58eb0" : "#fff"}
            trackColor={{ true: "#f7b5cc", false: "#ddd" }}
          />
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons name="phone-portrait-outline" size={22} color={themeStyles.icon.color} />
            <Text style={[styles.optionText, themeStyles.text]}>Vibración</Text>
          </View>
          <Switch
            value={vibracionActiva}
            onValueChange={setVibracionActiva}
            thumbColor={vibracionActiva ? "#f58eb0" : "#fff"}
            trackColor={{ true: "#f7b5cc", false: "#ddd" }}
          />
        </View>
      </View>

      {/* Sección de notificaciones */}
      <Text style={[styles.sectionTitle, themeStyles.text, { marginTop: 20 }]}>
        Recordatorios de citas
      </Text>

      {citas.length === 0 ? (
        <Text style={[styles.empty, themeStyles.text]}>
          No tienes citas programadas actualmente
        </Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, themeStyles.card]}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#f58eb0" />
                <Text style={[styles.cardTitle, themeStyles.text]}>
                  {item.pacientes?.nombre ?? item.paciente?.nombre ?? "Paciente"}
                </Text>
              </View>
              <Text style={[styles.cardText, themeStyles.text]}>
                Fecha: {item.fecha_hora}
              </Text>
              <TouchableOpacity
                style={[styles.btn, themeStyles.btn]}
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
        <TouchableOpacity
          style={[styles.cancelBtn, themeStyles.cancelBtn]}
          onPress={cancelarNotificaciones}
        >
          <MaterialIcons name="cancel" size={20} color="#fff" />
          <Text style={styles.cancelTxt}>Cancelar todas las notificaciones</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* 🎨 Temas */
const lightTheme = StyleSheet.create({
  container: { backgroundColor: "#fff0f5" },
  card: { backgroundColor: "#ffe6f0" },
  text: { color: "#333" },
  title: { color: "#f58eb0" },
  btn: { backgroundColor: "#faa3c0" },
  cancelBtn: { backgroundColor: "#d66f91" },
  icon: { color: "#f58eb0" },
});

const darkTheme = StyleSheet.create({
  container: { backgroundColor: "#2b2b2b" },
  card: { backgroundColor: "#3b3b3b" },
  text: { color: "#fff" },
  title: { color: "#f8b6cc" },
  btn: { backgroundColor: "#f58eb0" },
  cancelBtn: { backgroundColor: "#bb5070" },
  icon: { color: "#f8b6cc" },
});

/* 💅 Estilos base */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginLeft: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  optionText: { fontSize: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  cardTitle: { fontWeight: "bold", marginLeft: 6 },
  cardText: { marginBottom: 4 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 6,
  },
  cancelTxt: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 20, fontSize: 15 },
});
