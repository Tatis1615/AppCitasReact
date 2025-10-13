import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { fetchWithAuth } from "../../Src/api";

export default function EditarEspecialidad({ route, navigation }) {
  const { especialidad } = route.params;
  const [nombre_e, setNombre] = useState(especialidad?.nombre_e || "");

  // Si no vino el nombre en params, traerlo del backend
  useEffect(() => {
    const ensureNombre = async () => {
      if (nombre_e || !especialidad?.id) return;
      try {
        const res = await fetchWithAuth(`/especialidades/${especialidad.id}`, { method: "GET" });
        const raw = await res.text();
        let data = null;
        try { data = raw ? JSON.parse(raw) : null; } catch {}
        const esp = data?.data ?? data;
        if (esp?.nombre_e) setNombre(esp.nombre_e);
      } catch {}
    };
    ensureNombre();
  }, [especialidad?.id]);

  const handleGuardar = async () => {
    try {
      const response = await fetchWithAuth(`/actualizarEspecialidad/${especialidad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_e }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
       alert("Especialidad actualizado con éxito");
        navigation.navigate("ListarEspecialidades");
      } else {
        console.log("Backend respondió con error:", data);
        alert("Error al actualizar la especialidad");
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

      <Text style={styles.title}>Editar Especialidad</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de la Especialidad:</Text>
        <TextInput
          style={styles.input}
          value={nombre_e}
          onChangeText={setNombre}
          placeholder="Ej: Cardiología"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
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
});
