import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { fetchWithAuth } from "../../Src/api";

export default function CrearEspecialidad({ navigation }) {
  const [nombre_e, setNombre] = useState("");

  const handleCrear = async () => {
    if (!nombre_e) {
      Alert.alert("Falta información", "Por favor completa todos los campos");
      return;
    } 

    try {
      const response = await fetchWithAuth(`/crearEspecialidad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_e }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Especialidad creada correctamente");
        navigation.navigate("ListarEspecialidades");
      } else {
        console.log("Errores:", data);
        Alert.alert("Error", data.message || "No se pudo crear la especialidad");
      }
    } catch (error) {
      console.error("Error en crear especialidad:", error);
      alert("Error", "Hubo un problema al conectar con el servidor");
    }

  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}>Agendar Nueva Especialidad</Text>
        <TextInput
            style={styles.input}
            placeholder="Nombre de la especialidad"
            value={nombre_e}
            onChangeText={setNombre}
        />
      
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Especialidad</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.goBack()}
      >
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
