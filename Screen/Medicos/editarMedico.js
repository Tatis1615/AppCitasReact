import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import ModalSelector from "react-native-modal-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function EditarMedico({ route, navigation }) {
  const { medico } = route.params;
  const [especialidad_id, setEspecialidadId] = useState(medico.especialidad_id);
  const [consultorio_id, setConsultorioId] = useState(
    medico.consultorio_id || medico.consultorio?.id || ""
  );
  const [nombre_m, setNombre] = useState(medico.nombre_m);
  const [apellido_m, setApellido] = useState(medico.apellido_m);
  const [edad, setEdad] = useState(String(medico.edad));
  const [telefono, setTelefono] = useState(medico.telefono);
  const [email, setEmail] = useState(medico.email);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);

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

        const data = await response.json();

        if (response.ok) {
          setEspecialidades(data);
        } else {
          console.log("Error cargando especialidades:", data);
          alert("No se pudieron cargar las especialidades");
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("Error al conectar con el servidor");
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

        const data = await response.json();

        if (response.ok) {
          setConsultorios(data);
        } else {
          console.log("Error cargando consultorios:", data);
          alert("No se pudieron cargar los consultorios");
        }
      } catch (error) {
        console.error("Error de red (consultorios):", error);
        alert("Error al conectar con el servidor");
      }
    };

    fetchEspecialidades();
    fetchConsultorios();
  }, []);

  const handleGuardar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/actualizarMedico/${medico.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            especialidad_id: String(especialidad_id),
            consultorio_id: consultorio_id ? String(consultorio_id) : undefined,
            nombre_m,
            apellido_m,
            edad,
            telefono,
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Medico actualizado con éxito");
        navigation.navigate("ListarMedicos");
      } else {
        console.log("Backend respondió con error:", data);
        alert((data.message || "Error al actualizar el medico"));
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Editar Médico</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Especialidad:</Text>
        <SelectInput
          data={especialidades.map((esp) => ({ key: esp.id, label: esp.nombre_e }))}
          value={especialidad_id}
          onChange={setEspecialidadId}
          placeholder="Seleccione la especialidad..."
        />

        <Text style={styles.label}>Consultorio:</Text>
        <SelectInput
          data={consultorios.map((c) => ({ key: c.id, label: `Consultorio N° ${c.numero}${c.ubicacion ? ` — ${c.ubicacion}` : ""}` }))}
          value={consultorio_id}
          onChange={setConsultorioId}
          placeholder="Seleccione el consultorio..."
        />


        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          value={nombre_m}
          onChangeText={setNombre}
          style={styles.input}
        />

        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          value={apellido_m}
          onChangeText={setApellido}
          style={styles.input}
        />

        <Text style={styles.label}>Edad:</Text>
        <TextInput
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
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
    flex: 1,
    backgroundColor: "#fff0f5",
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e38ea8",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
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
    borderColor: "#e38ea8",
    padding: 12,
    borderRadius: 15,
    marginVertical: 1,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
});
