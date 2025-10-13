import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearAdmin({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Por favor completa todos los campos básicos");
      return;
    }


    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Éxito", "Admin creado correctamente");
        navigation.navigate("ListarAdmin");
      } else {
        console.log("Errores:", data);
        alert("Error", data.message || "No se pudo crear el admin");
      }
    } catch (error) {
      console.error("Error en crear admin:", error);
      alert("Error", "Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}>Registrar Nuevo Administrador</Text>

      {/* Campos básicos */}
      <TextInput style={styles.input} placeholder="Nombre de usuario" placeholderTextColor="#cc6699" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#cc6699" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#cc6699" secureTextEntry value={password} onChangeText={setPassword} />

      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={[
          { label: "Administrador", value: "admin" },
        ]}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un rol"
        placeholderTextColor="#cc6699"
        value={role}
        onChange={(item) => setRole(item.value)}
        placeholderStyle={styles.placeholderStyle}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear Admin</Text>
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
  dropdown: {
    width: "100%",
    borderRadius: 13,
    padding: 13,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    backgroundColor: "#ffffffff",
    marginVertical: 8,
  },
  dropdownContainer: { borderRadius: 12, backgroundColor: "#ffe4ec", borderWidth: 1, borderColor: "#ffb6c1" },
});

