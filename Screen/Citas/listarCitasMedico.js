import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitasMedico({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMedico, setIsMedico] = useState(null);
  const [medicoEmail, setMedicoEmail] = useState(null);
  const [medicoId, setMedicoId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          Alert.alert("Sesión requerida", "Debes iniciar sesión para ver tus citas");
          setIsMedico(false);
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
          }
        } catch (e) {
          console.warn("Error obteniendo /me:", e);
        }

        const res = await fetch(`${API_BASE_URL}/listarCitasMedico`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const json = await res.json().catch(() => ({}));
        console.log("listarCitasMedico response:", json);

        if (res.ok && json.success) {
          setCitas(json.data ?? []);
          const emailFromResp = json.email ?? json.medico?.email ?? null;
          const idFromResp = json.medico_id ?? json.medico?.id ?? null;

          if (emailFromResp) {
            setMedicoEmail(emailFromResp);
            await AsyncStorage.setItem("medico_email", emailFromResp);
          } else if (userEmail) {
            setMedicoEmail(userEmail);
            await AsyncStorage.setItem("medico_email", userEmail);
          }

          if (idFromResp) {
            setMedicoId(String(idFromResp));
            await AsyncStorage.setItem("medico_id", String(idFromResp));
          }

          setIsMedico(true);
        } else {
          setCitas([]);
          setIsMedico(false);
          await AsyncStorage.removeItem("medico_email");
          await AsyncStorage.removeItem("medico_id");

          if (res.ok && json.success === false) {
            console.log("Backend indica que no es médico");
          } else {
            console.warn("listarCitasMedico no devolvió success:true", res.status, json);
          }
        }
      } catch (error) {
        console.error("Error obteniendo citas del médico:", error);
        Alert.alert("Error", "Ocurrió un problema al cargar tus citas.");
        setIsMedico(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

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
      <Text style={styles.title}>Lista de mis citas médicas</Text>

      {citas.length === 0 ? (
        <Text style={styles.warningText}>
          {isMedico ? "No tienes citas registradas" : "No estás registrado como médico"}
        </Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("DetalleCitaMedico", { cita: item })}
            >
              <View style={styles.cardContent}>
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="#e38ea8"
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.date}>{item.fecha_hora}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.doctor}>
                      Paciente: {item.pacientes?.nombre ?? item.paciente?.nombre ?? "Sin nombre"}{" "}
                      {item.pacientes?.apellido ?? item.paciente?.apellido ?? ""}
                    </Text>
                    <View
                      style={[
                        styles.estadoBadge,
                        item.estado === "pendiente"
                          ? { backgroundColor: "#b3d8ffff" }
                          : item.estado === "confirmada"
                          ? { backgroundColor: "#dfc6f6ff" }
                          : item.estado === "completado"
                          ? { backgroundColor: "#c3e6cb" }
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
  warningText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
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
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  doctor: {
    color: "#555",
    fontSize: 15,
  },
  estadoBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginLeft: 8,
  },
  estadoText: {
    fontWeight: "bold",
    color: "#444",
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
