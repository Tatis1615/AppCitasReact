import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";
import ModalSelector from "react-native-modal-selector";
import { fetchWithAuth } from "../../Src/api";

export default function DetalleCitaPaciente({ route, navigation }) {
  const params = route.params || {};
  const idFromParams = params.id ?? params.cita?.id ?? params.cita_id ?? null;
  const [citaId] = useState(Number(idFromParams)); 

  const { cita } = params;
  const [medico, setMedico] = useState(null);
  const [consultorio, setConsultorioNumero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadoSel, setEstadoSel] = useState(cita?.estado || "");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [motivoCancel, setMotivoCancel] = useState("");

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        if (cita?.medico_id) {
          const res = await fetchWithAuth(`/medicos/${cita.medico_id}`, { method: "GET" });
          if (res.ok) setMedico(await res.json());
        }
        if (cita.consultorios) {
          setConsultorioNumero(cita.consultorios.numero ?? "No disponible");
        }
      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [cita]);

  const handleCancelarCita = async () => {
    if (!citaId || isNaN(citaId)) {
      Alert.alert("Error", "ID de cita inválido. No se puede actualizar.");
      return;
    }
    Alert.alert(
      "Confirmar",
      "¿Seguro que deseas cancelar la cita?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => {
            if (estadoSel !== "cancelada") setEstadoSel("cancelada");
            setShowCancelModal(true);
          },
        },
      ]
    );
  };

  const confirmarCancelacion = async () => {
    if (!motivoCancel.trim()) {
      Alert.alert("Motivo requerido", "Por favor, ingresa el motivo de cancelación.");
      return;
    }
    try {
      const resp = await fetchWithAuth(`/actualizarCita/${citaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "cancelada", motivo_cancelacion: motivoCancel.trim() }),
      });
      const raw = await resp.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}
      if (resp.ok) {
        // Actualizar estado local
        try {
          if (params.cita) {
            params.cita.estado = "cancelada";
            params.cita.motivo_cancelacion = motivoCancel.trim();
          }
          setEstadoSel("cancelada");
        } catch {}
        Alert.alert("Éxito", data?.message || "La cita fue cancelada.");
        setShowCancelModal(false);
        navigation.navigate("ListarCitasPaciente");
      } else if (resp.status === 422) {
        const messages = data?.errors
          ? Object.entries(data.errors)
              .map(([field, msgs]) => `• ${field}: ${[].concat(msgs).join(", ")}`)
              .join("\n")
          : (data?.message || "Verifica los campos ingresados");
        Alert.alert("Errores de validación", messages);
      } else {
        console.warn("Error al cancelar cita:", data);
        Alert.alert("Error", data?.message || "No se pudo cancelar la cita.");
      }
    } catch (e) {
      console.error("Error de red al cancelar cita:", e);
      Alert.alert("Error", "No fue posible conectar con el servidor.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e38ea8" />
        <Text>Cargando cita...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Médico:</Text>
        <Text style={styles.value}>
          {medico ? `${medico.nombre_m} ${medico.apellido_m}` : "No disponible"}
        </Text>

        <Text style={styles.label}>Consultorio:</Text>
        <Text style={styles.value}>{consultorio || "No disponible"}</Text>

        <Text style={styles.label}>Fecha y hora:</Text>
        <Text style={styles.value}>{cita?.fecha_hora ?? "No disponible"}</Text>

        <Text style={styles.label}>Estado:</Text>
        {/* Selector de estado con única opción: Cancelada */}
        <ModalSelector
          data={[{ key: "cancelada", label: "Cancelar cita" }]}
          initValue={cita?.estado ? cita.estado : "Seleccionar"}
          onChange={(option) => setEstadoSel(option.key)}
          cancelText="Cerrar"
          optionContainerStyle={{ backgroundColor: "#fff0f5", borderRadius: 20, padding: 10 }}
          optionTextStyle={{ fontSize: 16, color: "#444", paddingVertical: 10 }}
          cancelStyle={{ backgroundColor: "#ffe4e1", borderRadius: 20, marginTop: 10 }}
          cancelTextStyle={{ fontSize: 16, color: "#cc3366", fontWeight: "bold" }}
          overlayStyle={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          initValueTextStyle={{ color: "#888", fontSize: 16 }}
          style={{ width: "100%", marginVertical: 8 }}
        >
          <View style={styles.inputSelect}>
            <Text style={{ color: estadoSel ? "#000" : "#888", fontSize: 16 }}>
              {estadoSel ? (estadoSel === "cancelada" ? "Cancelar cita" : estadoSel) : (cita?.estado || "Seleccionar")}
            </Text>
          </View>
        </ModalSelector>

        <Text style={styles.label}>Motivo:</Text>
        <Text style={styles.value}>{cita?.motivo ?? "No disponible"}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleCancelarCita}
        disabled={cita?.estado === "cancelada"}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>
          {cita?.estado === "cancelada" ? "Cita cancelada" : "Cancelar cita"}
        </Text>
      </TouchableOpacity>

      {/* Modal para capturar motivo de cancelación */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Motivo de cancelación</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Escribe el motivo (máx. 500 caracteres)"
              placeholderTextColor="#888"
              multiline
              maxLength={500}
              value={motivoCancel}
              onChangeText={setMotivoCancel}
            />
            <Text style={styles.charCounter}>{motivoCancel.length}/500</Text>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 6 }]} onPress={confirmarCancelacion}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { flex: 1, marginLeft: 6 }]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff0f5" },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold", color: "#e38ea8", textAlign: "center" },
  card: { backgroundColor: "#ffe6f0", padding: 15, borderRadius: 15, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#444" },
  value: { fontSize: 16, marginBottom: 10, color: "#333" },
  button: { backgroundColor: "#f7b2c4", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  cancelButton: { backgroundColor: "white", borderWidth: 1, borderColor: "#cc3366" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  deleteButton: { backgroundColor: "#d67693ff" },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c55b78",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 12,
    padding: 12,
    color: "#333",
    textAlignVertical: "top",
  },
  charCounter: {
    textAlign: "right",
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
});
