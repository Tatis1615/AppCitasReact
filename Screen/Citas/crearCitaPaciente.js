import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithAuth } from "../../Src/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearCitaPaciente({ route, navigation }) {
  const { paciente_id } = route.params;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({ medicos: [] });

  const [form, setForm] = useState({
    idMedico: "",
    idConsultorio: "",
    fecha_hora: "",
    estado: "Pendiente",
    motivo: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [pacienteEmail, setPacienteEmail] = useState("");

  const fetchMedicos = async () => {
    const res = await fetchWithAuth("/medicos", { method: "GET" });
    const text = await res.text();
    try { return text ? JSON.parse(text) : []; } catch { return []; }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicos = await fetchMedicos();
        setData({ medicos: Array.isArray(medicos) ? medicos : medicos?.data ?? [] });
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getPacienteEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("paciente_email");
        if (email) {
          setPacienteEmail(email);
        } else if (paciente_id) {
          const token = await AsyncStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/pacientes/${paciente_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const data = await res.json();
          const fetchedEmail = data.email || data.data?.email;
          if (fetchedEmail) {
            setPacienteEmail(fetchedEmail);
            await AsyncStorage.setItem("paciente_email", fetchedEmail);
          }
        }
      } catch (err) {
        console.warn("Error obteniendo email:", err);
      }
    };
    getPacienteEmail();
  }, [paciente_id]);


  const handleCrear = async () => {
    const { idMedico, motivo, fecha_hora } = form;

    if (!pacienteEmail) return Alert.alert("Error", "No se encontró el email del paciente.");
    if (!idMedico || !motivo || !fecha_hora)
      return Alert.alert("Campos incompletos", "Por favor completa todos los campos.");

    const medicoSel = data.medicos.find((m) => String(m.id) === String(idMedico));
    if (!medicoSel?.consultorio?.id && !medicoSel?.consultorio?.numero) {
      return Alert.alert("El médico seleccionado no tiene consultorio asignado. No es posible crear la cita.");
    }

    try {
      const response = await fetchWithAuth(`/crearCita`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id,
          medico_id: idMedico,
          fecha_hora,
          estado: form.estado,
          motivo,
        }),
      });

      const body = await response.json();
      if (response.ok) {
        Alert.alert("Cita creada correctamente");
        navigation.navigate("ListarCitasPaciente");
      } else {
        Alert.alert("Error", body.message || "No se pudo crear la cita");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error de conexión con el servidor");
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
        finalDate.toISOString().slice(0, 10) + " " + finalDate.toTimeString().slice(0, 5);
      setForm({ ...form, fecha_hora: fechaFormateada });
    }
  };

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fdacd2" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={50} 
    >
      <Text style={styles.title}>Agendar Nueva Cita</Text>


      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={data.medicos.map((m) => ({
          label: `${m.nombre_m} ${m.apellido_m ?? ''} — ${m.especialidades?.nombre_e ?? 'Sin especialidad'} — ${m.consultorio ? `Cons. ${m.consultorio.numero} (${m.consultorio.ubicacion ?? 's/ubicación'})` : 'Sin consultorio'}`,
          value: m.id,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un médico..."
        value={form.idMedico}
        onChange={(item) => setForm({ ...form, idMedico: item.value })}
      />

      {/* Consultorio asignado (solo lectura) */}
      <Text style={styles.label}>Consultorio asignado:</Text>
      <TextInput
        editable={false}
        style={styles.input}
        value={(data.medicos.find((m) => String(m.id) === String(form.idMedico))?.consultorio)
          ? `Consultorio ${data.medicos.find((m) => String(m.id) === String(form.idMedico))?.consultorio?.numero} — ${data.medicos.find((m) => String(m.id) === String(form.idMedico))?.consultorio?.ubicacion ?? ''}`
          : "Sin consultorio"
        }
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: form.fecha_hora ? "#000" : "#888" }}>
          {form.fecha_hora || "Selecciona fecha y hora"}
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
        value={form.motivo}
        onChangeText={(motivo) => setForm({ ...form, motivo })}
      />


      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Cita</Text>
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
    padding: 20,
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
    borderRadius: 10,
    fontSize: 16,
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
  selectButton: { 
    width: "100%",
    borderWidth: 1, 
    borderColor: "#ffb6c1", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 8, 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  selectWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
    width: "100%",
  },

  dropdown: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  dropdownContainer: {
    borderRadius: 16,
    backgroundColor: "#ffe4ec", 
    borderWidth: 1,
    borderColor: "#ffb6c1",
  },
});