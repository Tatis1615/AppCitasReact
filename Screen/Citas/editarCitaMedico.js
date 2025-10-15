import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { fetchWithAuth } from "../../Src/api";

export default function EditarCitaMedico({ route, navigation }) {
  const { cita } = route.params;

  const [paciente_id] = useState(cita.paciente_id);
  const [medico_id] = useState(cita.medico_id);
  const [consultorio_id] = useState(cita.consultorio_id);
  const [fecha_hora] = useState(cita.fecha_hora);
  const [estado, setEstado] = useState(cita.estado);
  const [motivo] = useState(cita.motivo);


  const handleGuardar = async () => {
    try {
      const response = await fetchWithAuth(`/actualizarCita/${cita.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        Alert.alert("Éxito", "Cita actualizada con éxito");
        navigation.navigate("ListarCitas");
      } else {
        console.warn("Error al actualizar:", data);
        Alert.alert("Error", "No se pudo actualizar la cita.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error", "No fue posible conectar con el servidor.");
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Cita</Text>

      <Text style={styles.label}>Paciente:</Text>
      <TextInput
        editable={false}
        style={[styles.input, styles.readOnly]}
        value={`${cita.pacientes?.nombre ?? cita.paciente?.nombre ?? ''} ${cita.pacientes?.apellido ?? cita.paciente?.apellido ?? ''}`.trim()}
      />

     
      <Text style={styles.label}>Consultorio:</Text>
      <TextInput
        editable={false}
        style={[styles.input, styles.readOnly]}
        value={`Consultorio ${cita.consultorio?.numero ?? cita.consultorio_id ?? ''}`}
      />

      <Text style={styles.label}>Fecha y hora:</Text>
      <TextInput
        editable={false}
        style={[styles.input, styles.readOnly]}
        value={fecha_hora}
      />


      <Text style={styles.label}>Estado:</Text>
      <SelectInput
        data={[
          { key: "pendiente", label: "Pendiente" },
          { key: "confirmada", label: "Confirmada" },
          { key: "cancelada", label: "Cancelada" },
          { key: "completado", label: "Completado" },
        ]}
        value={estado}
        onChange={setEstado}
        placeholder="Seleccione el estado..."
      />

      <Text style={styles.label}>Motivo:</Text>
      <TextInput
        editable={false}
        value={motivo}
        style={[styles.input, styles.readOnly]}
        placeholder="Ej: Consulta general"
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
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
        optionContainerStyle={{ backgroundColor: "#fff0f5", borderRadius: 20, padding: 10 }}
        optionTextStyle={{ fontSize: 16, color: "#444", paddingVertical: 10 }}
        cancelStyle={{ backgroundColor: "#ffe4e1", borderRadius: 20, marginTop: 10 }}
        cancelTextStyle={{ fontSize: 16, color: "#cc3366", fontWeight: "bold" }}
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        initValueTextStyle={{ color: "#888", fontSize: 16 }}
        selectTextStyle={{ color: "#000", fontSize: 16 }}
        style={{ width: "100%", marginVertical: 8 }}
      >
        <View style={styles.inputSelect}>
          <Text style={{ color: value ? "#000" : "#888", fontSize: 16 }}>
            {value ? data.find((d) => d.key === value)?.label : placeholder}
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
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
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  
});
