import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config"; 

export default function Inicio({ navigation }) {

const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); 

        if (!token) {
          console.log("No hay token guardado");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserName(data.user?.name || "Usuario");
        } else {
          console.log("Error en la respuesta:", data);
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎀 Bienvenido al sistema de Citas {userName} 🎀</Text>

      <View style={styles.grid}>
        

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Pacientes", { screen: "ListarPacientes" })}
        >
          <Ionicons name="person-add-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Pacientes</Text>
          <Text style={styles.cardDesc}>Ver pacientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicos", { screen: "ListarMedicos" })}
        >
          <Ionicons name="medkit-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardDesc}>Ver listado de médicos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Consultorios", { screen: "ListarConsultorios" })}
        >
          <Ionicons name="business-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Consultorios</Text>
          <Text style={styles.cardDesc}>Gestión de consultorios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Especialidades", { screen: "ListarEspecialidades" })}
        >
          <Ionicons name="fitness-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Especialidades</Text>
          <Text style={styles.cardDesc}>Gestión de especialidades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Admin", { screen: "ListarAdmin" })}
        >
          <Ionicons name="lock-closed-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Admin</Text>
          <Text style={styles.cardDesc}>Ver Administradores</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 35,
    color: "#e38ea8",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  card: {
    width: "40%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#e38ea8",
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: "#cc3366",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 35,
    width: 150,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
