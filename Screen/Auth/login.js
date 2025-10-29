import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa los datos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem("token", data.access_token);

        if (data.user) {
          await AsyncStorage.setItem("paciente_email", email);
          await AsyncStorage.setItem("user_tipo", data.user.tipo);
          await AsyncStorage.setItem("paciente_id", data.user.id.toString()); 
        }
        alert(data.message);

        if (data.user && data.user.tipo === "user") {
          navigation.navigate("Inicio");
        } else if (data.user && data.user.tipo === "paciente") {
          navigation.navigate("InicioPaciente");
        } else if (data.user && data.user.tipo === "medico") {
          navigation.navigate("InicioMedico");
        } else {
          alert("No se pudo determinar el tipo de usuario");
        }

      } else {
        alert(data.message || "Error en el login");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}> Iniciar Sesión ✨</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#cc6699"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" 
        autoCorrect={false} 
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginVertical: 0 }]}
          placeholder="Contraseña"
          placeholderTextColor="#cc6699"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none" 
          autoCorrect={false}   
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#ec688fff"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.registerLink}> Regístrate aquí </Text>
        </TouchableOpacity>
      </View>

    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6f0",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#e38ea8",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffb6c1",
    backgroundColor: "#fff0f5",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 16,
    color: "#660033",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff0f5",
    borderRadius: 12,
    marginVertical: 8,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#fba1b9ff",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#ec688fff",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  eyeButton: {
    padding: 5,
  },
  registerText: {
    fontSize: 16,
    color: "#884c5e",
  },
  registerLink: {
    fontSize: 16,
    color: "#ec688fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#ffe6f0",
    paddingVertical: 10,
    borderRadius: 15,
  },
});
