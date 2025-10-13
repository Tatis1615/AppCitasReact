import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearPacienteCita({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return;
        const data = await res.json();
        const user = data.user || data;

        setRole(user?.role ?? null);
        setUserId(user?.id ?? null);
        setEmail(user?.email ?? "");
      } catch (err) {
        console.error("Error fetching /me:", err);
      }
    };

    fetchMe();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const fechaISO = selectedDate.toISOString().split("T")[0];
      setFecha_nacimiento(fechaISO);
    }
  };

  const handleCrear = async () => {
    if (
      !nombre ||
      !apellido ||
      !documento ||
      !telefono ||
      !email ||
      !fecha_nacimiento ||
      !direccion
    ) {
      Alert.alert("Falta información", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión para crear pacientes");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/crearPaciente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          documento,
          telefono,
          email,
          fecha_nacimiento,
          direccion,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        Alert.alert(" Éxito", body.message || "Paciente creado correctamente");
        navigation.goBack();
        return;
      }

      Alert.alert("Error", body.message || "No se pudo crear el paciente");
    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert("Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>

        <Text style={styles.title}> Nuevo Paciente </Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#c88ca8"
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          value={apellido}
          onChangeText={setApellido}
          placeholderTextColor="#c88ca8"
        />

        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12345678"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          placeholderTextColor="#c88ca8"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3001234567"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          placeholderTextColor="#c88ca8"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            role?.toLowerCase() === "paciente" && { backgroundColor: "#ffe6ef" },
          ]}
          placeholder="Ej: correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#c88ca8"
          editable={role?.toLowerCase() !== "paciente"}
        />

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: fecha_nacimiento ? "#333" : "#c88ca8" }}>
            {fecha_nacimiento || "Seleccione una fecha"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fecha_nacimiento ? new Date(fecha_nacimiento) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Calle 123 #45-67"
          value={direccion}
          onChangeText={setDireccion}
          placeholderTextColor="#c88ca8"
        />

        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Paciente</Text>
        </TouchableOpacity>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeef6", 
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#cc6699",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cc3366",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#66334d",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f5b7c6",
    padding: 12,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#fff8fa",
    color: "#333",
  },
  button: {
    backgroundColor: "#f7b2c4",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
