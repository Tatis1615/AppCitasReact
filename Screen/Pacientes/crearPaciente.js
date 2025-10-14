import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearPaciente({ route, navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("paciente123");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCrear = async () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !fecha_nacimiento || !direccion || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
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
        body: JSON.stringify({ nombre, apellido, documento, telefono, email, fecha_nacimiento, direccion, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Paciente creado correctamente");
        navigation.navigate("ListarPacientes");
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
      extraScrollHeight={70}
    >
      <Text style={styles.title}>Crear Nuevo Paciente</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Documento" value={documento} onChangeText={setDocumento} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} />

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

      <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />

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

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.goBack()}>
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff0f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 35,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#e38ea8",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 12,
    marginVertical: 8,
    borderRadius: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cc3366",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
