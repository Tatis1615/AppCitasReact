import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarMedicos({ navigation }) {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/listarMedicos`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMedicos(data);
        } else {
          console.log("Error al obtener medico:", data);
        }
      } catch (error) {
        console.error("Error en fetchMedicos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text>Cargando médicos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Médicos </Text>

      <FlatList
        data={medicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleMedico", { id: item.id })}
          >
            <Image source={{ uri: "https://i.pinimg.com/1200x/1f/76/ac/1f76acfbd41313190d4ea2feb388d1f6.jpg" }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{item.nombre_m}</Text>
              <Text style={styles.cardSubtitle}>Edad: {item.edad} años</Text>
              <Text style={styles.cardSubtitle}>Telefono: {item.telefono}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearMedico")}
      >
        <Text style={styles.buttonText}>+ Crear Médico</Text>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
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
    marginTop: 20,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#ffe6f0",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ffb6c1",
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  cardSubtitle: {
    color: "#555",
    marginTop: 2,
  },
});
