import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitasPaciente({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaciente, setIsPaciente] = useState(null);
  const [pacienteEmail, setPacienteEmail] = useState(null);
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          Alert.alert("Sesión requerida", "Debes iniciar sesión para ver tus citas");
          setIsPaciente(false);
          return;
        }

        let userEmail = null;
        try {
          const meRes = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (meRes.ok) {
            const meJson = await meRes.json();
            const user = meJson.user ?? meJson;
            userEmail = user?.email ?? null;
            if (userEmail) {
              await AsyncStorage.setItem("user_email", userEmail);
            }
          } else {
            console.log("/me returned", meRes.status);
          }
        } catch (e) {
          console.warn("Error fetching /me:", e);
        }

        const res = await fetch(`${API_BASE_URL}/listarCitasPaciente`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const json = await res.json().catch(() => ({}));
        console.log("listarCitasPaciente response:", json);

        if (res.ok && json.success) {
          setCitas(json.data ?? []);
          const emailFromResp = json.email ?? json.paciente?.email ?? null;
          const idFromResp = json.paciente_id ?? json.paciente?.id ?? null;

          if (emailFromResp) {
            setPacienteEmail(emailFromResp);
            await AsyncStorage.setItem("paciente_email", emailFromResp);
          } else if (userEmail) {
            setPacienteEmail(userEmail);
            await AsyncStorage.setItem("paciente_email", userEmail);
          }

          if (idFromResp) {
            setPacienteId(String(idFromResp));
            await AsyncStorage.setItem("paciente_id", String(idFromResp));
          }

          setIsPaciente(true);
        } else {
          setCitas([]);
          setIsPaciente(false);
          await AsyncStorage.removeItem("paciente_email");
          await AsyncStorage.removeItem("paciente_id");

          if (res.ok && json.success === false) {
            console.log("Backend indica que no es paciente");
          } else {
            console.warn("listarCitasPaciente no devolvió success:true", res.status, json);
          }
        }
      } catch (error) {
        console.error("error obteniendo citas:", error);
        Alert.alert("Error", "Ocurrió un problema al cargar tus citas.");
        setIsPaciente(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleCrearCita = async () => {
    if (isPaciente === null) {
      Alert.alert("Espere", "Comprobando registro de paciente, inténtalo en un momento.");
      return;
    }

    if (!isPaciente) {
      Alert.alert(
        "Registro requerido",
        "Debes registrarte como paciente antes de crear una cita."
      );
      navigation.navigate("CrearPacienteCita");
      return;
    }

    const payloadPacienteId = await AsyncStorage.getItem("paciente_id");
    const payloadEmail = (await AsyncStorage.getItem("paciente_email")) ?? pacienteEmail;

    navigation.navigate("CrearCitaPaciente", {
      paciente_id: payloadPacienteId ?? null,
      paciente_email: payloadEmail ?? null,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f58eb0ff" />
        <Text style={{ marginTop: 10, color: "#f58eb0ff" }}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de mis citas</Text>

      <View style={styles.topButtons}>
        <TouchableOpacity
          style={[
            styles.topButton,
            { backgroundColor: isPaciente ? "#f58eb0ff" : "#aaa" },
          ]}
          disabled={!isPaciente}
          onPress={handleCrearCita}
        >
          <Text style={styles.topButtonText}>Agregar nueva cita</Text>
        </TouchableOpacity>
        

        {!isPaciente && (
          <TouchableOpacity
            style={[styles.topButton, { backgroundColor: "#f58eb0ff" }]}
            onPress={() => navigation.navigate("CrearPacienteCita")}
          >
            <Text style={styles.topButtonText}>Datos adicionales</Text>
          </TouchableOpacity>
        )}
      </View>

      {citas.length === 0 ? (
        <Text style={styles.warningText}>
          {isPaciente ? "No tienes citas pendientes" : "No estás registrado como paciente"}
        </Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("DetalleCitaPaciente", { cita: item })}
            >
              <View style={styles.cardContent}>
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color="#ffb6c1"
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.date}>{item.fecha_hora}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.doctor}>
                      {item.medicos?.nombre_m ?? item.medico?.nombre_m ?? "Médico"}{" "}
                      {item.medicos?.apellido_m ?? item.medico?.apellido_m ?? ""}
                    </Text>
                    <View
                      style={[
                        styles.estadoBadge,
                        item.estado === "pendiente"
                          ? { backgroundColor: "#b3d8ffff" }
                          : item.estado === "confirmada"
                          ? { backgroundColor: "#dfc6f6ff" }
                          : { backgroundColor: "#ffc1d8ff" },
                      ]}
                    >
                      <Text style={styles.estadoText}>
                        {(item.estado ?? "").toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
    backgroundColor: "pink",
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 25, 
    alignItems: "center", 
    marginBottom: 250, 
  }, 
  buttonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16, 
  }, 
  card: { 
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: "#ffb6c1", 
    backgroundColor: "#ffe6f0", 
    marginBottom: 12, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4, 
    elevation: 4, 
  }, 
  cardTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#333", 
  }, 
  cardSubtitle: { 
    color: "#555", 
  }, 
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
    marginLeft: 8 
  }, 
  addButton: { 
    backgroundColor: "#f58eb0ff", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 15, 
    borderRadius: 20, 
    marginTop: 15, 
    marginBottom: 10, 
  }, 
  estadoBadge: { 
    paddingVertical: 2, 
    paddingHorizontal: 8, 
    borderRadius: 15, 
    marginLeft: 8, 
  }, 
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    marginTop: 5,
  },

  topButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  topButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
