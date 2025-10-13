import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, TextInput, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";

export default function CrearCita({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [motivo, setMotivo] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const fetchData = async (endpoint, setter, errorMsg) => {
    try {
      const response = await fetchWithAuth(`/${endpoint}`, { method: "GET" });
      const data = await response.json();
      setter(Array.isArray(data) ? data : data?.data ?? []);
    } catch (error) {
      console.error(`${errorMsg}:`, error);
      Alert.alert("Error", errorMsg);
    }
  };

  useEffect(() => {
    fetchData("listarPacientes", setPacientes, "Error al cargar pacientes");
    // Usar /medicos que ya incluye especialidades y consultorio
    fetchData("medicos", setMedicos, "Error al cargar médicos");
  }, []);

  const selectedMedico = useMemo(
    () => medicos.find((m) => String(m.id) === String(medicoId)),
    [medicos, medicoId]
  );

  const handleCrear = async () => {
    try {
      const pacienteStorage = await AsyncStorage.getItem("paciente_id");
      const finalPacienteId = Number(pacienteId || pacienteStorage);

      if (!finalPacienteId || !medicoId || !fechaHora || !motivo) {
        Alert.alert("Por favor completa todos los campos antes de continuar.");
        return;
      }

      // Validar que el médico tenga consultorio asignado
      if (!selectedMedico?.consultorio?.id && !selectedMedico?.consultorio?.numero) {
        Alert.alert("El médico seleccionado no tiene consultorio asignado. No es posible crear la cita.");
        return;
      }

      const response = await fetchWithAuth(`/crearCita`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: finalPacienteId,
          medico_id: Number(medicoId),
          fecha_hora: fechaHora,
          estado,
          motivo,
        }),
      });

  const data = await response.json();

      if (response.ok) {
        Alert.alert("Cita creada correctamente");
        navigation.navigate("ListarCitas");
      } else {
        console.error("Errores del servidor:", data);
        Alert.alert("Error", data.message || "No se pudo crear la cita");
      }
    } catch (error) {
      console.error("Error en crear cita:", error);
      Alert.alert("Hubo un problema al conectar con el servidor");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());
      const fechaFormateada = finalDate.toISOString().slice(0, 10) + " " + finalDate.toTimeString().slice(0, 5);
      setFechaHora(fechaFormateada);
    }
  };

  const SelectInput = ({ data, value, onChange, placeholder }) => (
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
      style={{ width: "100%", marginVertical: 8 }}
    >
      <View style={styles.inputSelect}>
        <Text style={{ color: value ? "#000" : "#888", fontSize: 16 }}>
          {value ? data.find((d) => d.key === value)?.label : placeholder}
        </Text>
      </View>
    </ModalSelector>
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      <SelectInput
        data={pacientes.map((p) => ({ key: p.id, label: p.nombre }))}
        value={pacienteId}
        onChange={setPacienteId}
        placeholder="Seleccione el paciente..."
      />

      <SelectInput
        data={medicos.map((m) => ({
          key: m.id,
          label: `${m.nombre_m} ${m.apellido_m ?? ''} — ${m.especialidades?.nombre_e ?? 'Sin especialidad'} — ${m.consultorio ? `Cons. ${m.consultorio.numero} (${m.consultorio.ubicacion ?? 's/ubicación'})` : 'Sin consultorio'}`,
        }))}
        value={medicoId}
        onChange={setMedicoId}
        placeholder="Seleccione el médico..."
      />

      {/* Consultorio asignado (solo lectura) */}
      <Text style={styles.label}>Consultorio asignado:</Text>
      <TextInput
        editable={false}
        style={[styles.input, { color: "#555" }]}
        value={
          selectedMedico?.consultorio
            ? `Consultorio ${selectedMedico.consultorio.numero} — ${selectedMedico.consultorio.ubicacion ?? ''}`
            : "Sin consultorio"
        }
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: fechaHora ? "#000" : "#888" }}>
          {fechaHora || "Selecciona fecha y hora"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTime}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Motivo de la cita"
        value={motivo}
        onChangeText={setMotivo}
      />

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Cita</Text>
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
    padding: 14,
    borderRadius: 17,
    marginVertical: 15,
    justifyContent: "center",
    elevation: 3,
  },
  inputSelect: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 14,
    borderRadius: 17,
    marginVertical: 8,
    justifyContent: "center",
    elevation: 3,
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
