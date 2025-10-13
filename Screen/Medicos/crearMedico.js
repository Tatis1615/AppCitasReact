import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalSelector from "react-native-modal-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearMedico({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad_id, setEspecialidadId] = useState(""); 
  const [consultorios, setConsultorios] = useState([]);
  const [consultorio_id, setConsultorioId] = useState("");
  const [nombre_m, setNombre] = useState("");
  const [apellido_m, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("medico123");

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarEspecialidades`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudieron cargar las especialidades");

        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error cargando especialidades:", error);
        alert("Error al cargar especialidades");
      }
    };
    const fetchConsultorios = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarConsultorios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudieron cargar los consultorios");

        const data = await response.json();
        setConsultorios(data);
      } catch (error) {
        console.error("Error cargando consultorios:", error);
        alert("Error al cargar consultorios");
      }
    };

    fetchEspecialidades();
    fetchConsultorios();
  }, []);

  const handleCrear = async () => {
    if (!especialidad_id || !consultorio_id || !nombre_m || !apellido_m || !edad || !telefono ||!email || !password) {
      alert(" Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crearMedico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ especialidad_id, consultorio_id, nombre_m, apellido_m, edad, telefono, email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Médico creado correctamente");
        navigation.navigate("ListarMedicos");
      } else {
        console.log("Errores:", data);
        alert((data.message || "No se pudo crear el médico"));
      }
    } catch (error) {
      console.error("Error en crear médico:", error);
      alert(" Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={70} 
    >
      <Text style={styles.title}>Registrar Nuevo Médico</Text>

      <SelectInput
        data={especialidades.map((esp) => ({ key: esp.id, label: esp.nombre_e }))}
        value={especialidad_id}
        onChange={setEspecialidadId}
        placeholder="Seleccione la especialidad..."
      />

      <SelectInput
        data={consultorios.map((c) => ({ key: c.id, label: `Consultorio N° ${c.numero}${c.ubicacion ? ` — ${c.ubicacion}` : ""}` }))}
        value={consultorio_id}
        onChange={setConsultorioId}
        placeholder="Seleccione el consultorio..."
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre_m}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido_m}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> 

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Médico</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );

  function SelectInput({ data, value, onChange, placeholder }) {
    return (
      <ModalSelector
        data={data}
        initValue={placeholder}
        onChange={(option) => onChange(option.key)}
        cancelText="Cancelar"

        optionContainerStyle={{
          backgroundColor: "#fff0f5", 
          borderRadius: 20,
          padding: 10,
        }}
        optionTextStyle={{
          fontSize: 16,
          color: "#444",
          paddingVertical: 10,
        }}
        cancelStyle={{
          backgroundColor: "#ffe4e1", 
          borderRadius: 20,
          marginTop: 10,
        }}
        cancelTextStyle={{
          fontSize: 16,
          color: "#cc3366",
          fontWeight: "bold",
        }}
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        initValueTextStyle={{ color: "#888", fontSize: 16 }}
        selectTextStyle={{ color: "#000", fontSize: 16 }}
        style={{ width: "100%", marginVertical: 8 }}
      >
        <View style={styles.inputSelect}>
          <Text style={{ color: value ? "#000" : "#888", fontSize: 16 }}>
            {value
              ? data.find((d) => d.key === value)?.label
              : placeholder}
          </Text>
        </View>
      </ModalSelector>
      
    );
  }
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
    padding: 14,
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: "center",
    elevation: 3,
  },
  button: {
    backgroundColor: "pink",
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
  inputSelect: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 14,
    borderRadius: 15,
    marginVertical: 8,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
});
