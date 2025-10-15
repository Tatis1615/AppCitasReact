import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";

export default function EditarCita({ route, navigation }) {
  const { cita } = route.params;
  const [paciente_id, setPacienteId] = useState(cita.paciente_id);
  const [medico_id, setMedicoId] = useState(cita.medico_id);
  const [consultorio_id, setConsultorioId] = useState(cita.consultorio_id);
  const [fecha_hora, setFechaHora] = useState(cita.fecha_hora);
  const [estado, setEstado] = useState(cita.estado);
  const [motivo, setMotivo] = useState(cita.motivo);

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios] = useState([]); 

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const fetchData = async (endpoint, setState, errorMsg) => {
    try {
      const response = await fetchWithAuth(`/${endpoint}`, { method: "GET" });
      const data = await response.json();
      setState(Array.isArray(data) ? data : data?.data ?? []);
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error", errorMsg);
    }
  };

  useEffect(() => {
    fetchData("listarPacientes", setPacientes, "No se pudieron cargar los pacientes");
    fetchData("medicos", setMedicos, "No se pudieron cargar los médicos");
  }, []);

  const selectedMedico = useMemo(
    () => medicos.find((m) => String(m.id) === String(medico_id)),
    [medicos, medico_id]
  );

  const handleGuardar = async () => {
    try {
      if (!selectedMedico?.consultorio?.id && !selectedMedico?.consultorio?.numero) {
        return Alert.alert("El médico seleccionado no tiene consultorio asignado. No es posible actualizar la cita.");
      }

      const response = await fetchWithAuth(`/actualizarCita/${cita.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id,
          medico_id,
          fecha_hora,
          estado,
          motivo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Cita actualizada con éxito");
        navigation.navigate("ListarCitas");
      } else {
        console.log("Backend respondió con error:", data);
        Alert.alert("Error", "No se pudo actualizar la cita");
      }
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error", "Error de conexión con el servidor");
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

      const fechaFormateada =
        finalDate.toISOString().slice(0, 10) +
        " " +
        finalDate.toTimeString().slice(0, 5);

      setFechaHora(fechaFormateada);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Editar Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Paciente:</Text>
        <SelectInput
          data={pacientes.map((p) => ({ key: p.id, label: p.nombre }))}
          value={paciente_id}
          onChange={setPacienteId}
          placeholder="Seleccione el paciente..."
        />

        <Text style={styles.label}>Médico:</Text>
        <SelectInput
          data={medicos.map((m) => ({
            key: m.id,
            label: `${m.nombre_m} ${m.apellido_m ?? ''} — ${m.especialidades?.nombre_e ?? 'Sin especialidad'} — ${m.consultorio ? `Cons. ${m.consultorio.numero} (${m.consultorio.ubicacion ?? 's/ubicación'})` : 'Sin consultorio'}`,
          }))}
          value={medico_id}
          onChange={setMedicoId}
          placeholder="Seleccione el médico..."
        />

        {/* Consultorio asignado (solo lectura) */}
        <Text style={styles.label}>Consultorio asignado:</Text>
        <TextInput
          editable={false}
          style={styles.input}
          value={
            selectedMedico?.consultorio
              ? `Consultorio ${selectedMedico.consultorio.numero} — ${selectedMedico.consultorio.ubicacion ?? ''}`
              : "Sin consultorio"
          }
        />

        <Text style={styles.label}>Fecha y hora de la cita:</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fecha_hora ? "#000" : "#888" }}>
            {fecha_hora || "Selecciona fecha y hora"}
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

        <Text style={styles.label}>Estado:</Text>
        <SelectInput
          data={[
            { key: "pendiente", label: "Pendiente" },
            { key: "confirmada", label: "Confirmada" },
            { key: "cancelada", label: "Cancelada" },
          ]}
          value={estado}
          onChange={setEstado}
          placeholder="Seleccione el estado..."
        />

        <Text style={styles.label}>Motivo:</Text>
        <TextInput
          value={motivo}
          onChangeText={setMotivo}
          style={styles.input}
          placeholder="Ej: Consulta general"
        />
      </View>
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
}

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
          {value ? data.find((d) => d.key === value)?.label : placeholder}
        </Text>
      </View>
    </ModalSelector>
  );
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
    borderWidth: 1,
    borderColor: "#e38ea8",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12, 
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
});
