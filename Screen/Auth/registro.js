import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  // Paciente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleRegister = async () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !fecha_nacimiento || !direccion || !password) {
      alert(" Por favor completa todos los campos");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Contraseña débil", "La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/crearPaciente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ nombre, apellido, documento, telefono, email, fecha_nacimiento, direccion, password}),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Paciente creado correctamente");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "No se pudo crear el paciente");
      }
    } catch (error) {
      console.error("Error en crear paciente:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor");
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const fechaFormateada = selectedDate.toISOString().split("T")[0];
      setFecha_nacimiento(fechaFormateada);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}>✨ Registro ✨</Text>

        <TextInput 
        style={styles.input} 
        placeholder="Nombre" 
        value={nombre} 
        onChangeText={setNombre} 
        />
        <TextInput 
        style={styles.input} 
        placeholder="Apellido" 
        value={apellido} 
        onChangeText={setApellido} 
        />
        <TextInput 
        style={styles.input} 
        placeholder="Documento" 
        value={documento} 
        onChangeText={setDocumento} 
        />
        <TextInput 
        style={styles.input} 
        placeholder="Teléfono" 
        value={telefono} 
        onChangeText={setTelefono} 
        />

        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fecha_nacimiento ? "#000" : "#707070ff" }}>
            {fecha_nacimiento || "Selecciona fecha de nacimiento"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeFecha}
            maximumDate={new Date()}
          />
        )}

        <TextInput 
        style={styles.input} 
        placeholder="Dirección" 
        value={direccion} 
        onChangeText={setDireccion} 
        />

        <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
        autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none" 
          autoCorrect={false}  
        />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffe6f0",
    alignItems: "center",
    padding: 35,
    paddingTop: 50,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#dd5783ff" },
  subtitle: { fontSize: 20, fontWeight: "bold", color: "#cc3366", marginBottom: 10, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff0f5",
    padding: 12,
    marginVertical: 8,
    borderRadius: 15,
    fontSize: 16,
    color: "#660033",
  },
  extraContainer: { marginTop: 20, backgroundColor: "#fff5f8", padding: 15, borderRadius: 12 },
  button: {
    backgroundColor: "#ff9cbdff",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  secondaryButton: { backgroundColor: "#ff7eb2ff" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
});

