import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, TextInput, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchWithAuth } from "../../Src/api";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorioTexto, setConsultorioTexto] = useState("");
  const [consultorios, setConsultorios] = useState([]);

  const mapConsultorioTexto = (medicoObj, consultoriosList) => {
    if (!medicoObj) return "";
    const cons = medicoObj.consultorio;
    if (cons && (cons.numero || cons.ubicacion)) {
      return `Consultorio N° ${cons.numero}${cons.ubicacion ? ` - ${cons.ubicacion}` : ""}`;
    }
    const cid = medicoObj.consultorio_id;
    if (cid && Array.isArray(consultoriosList) && consultoriosList.length) {
      const found = consultoriosList.find((c) => String(c.id) === String(cid));
      if (found) {
        return `Consultorio N° ${found.numero}${found.ubicacion ? ` - ${found.ubicacion}` : ""}`;
      }
    }
    return "";
  };

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [pacienteData, setPacienteData] = useState({});
  const [medicoData, setMedicoData] = useState({});

  const apiRequest = async (endpoint, method = "GET", body = null) => {
    const options = { method };
    if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    const res = await fetchWithAuth(endpoint, options);
    const raw = await res.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.log("Perfil apiRequest JSON parse error:", e, raw);
    }

    if (!res.ok) {
      console.log("Perfil apiRequest error:", {
        endpoint,
        method,
        status: res.status,
        statusText: res.statusText,
        body: raw,
      });
      const err = new Error((data && data.message) || "Error en la solicitud");
      err.status = res.status;
      err.details = data;
      throw err;
    }
    return data;
  };

  useEffect(() => {
    const init = async () => {
      try {
  const especialidadesRes = await apiRequest("/especialidades");
        const lista =
          Array.isArray(especialidadesRes)
            ? especialidadesRes
            : especialidadesRes.data || [];
        setEspecialidades(lista);

        const userRes = await apiRequest("/me");
        let consList = [];
        try {
          const consRes = await apiRequest("/listarConsultorios");
          consList = Array.isArray(consRes) ? consRes : consRes?.data || [];
          setConsultorios(consList);
        } catch (e) {
          console.log("Perfil: no se pudo cargar listarConsultorios (no bloqueante)", e);
        }
        const currentUser = userRes.user || userRes; 
        const roleOrTipo = currentUser?.tipo || currentUser?.role;
        const normalizedUser = { ...currentUser, role: roleOrTipo };
        setUser(normalizedUser);
        setUserInfo({
          name: normalizedUser.name || "",
          email: normalizedUser.email || "",
          password: "",
        });

        if (normalizedUser.role === "paciente") {
          const p = await apiRequest(
            `/pacientePorEmail/${encodeURIComponent(normalizedUser.email)}`
          );
          if (p.success) setPacienteData(p.data);
        }

        if (normalizedUser.role === "medico") {
          const m = await apiRequest(
            `/medicoPorEmail/${encodeURIComponent(normalizedUser.email)}`
          );
          if (m.success)
            setMedicoData({
              ...m.data,
              especialidad_id: m.data.especialidad_id?.toString() || "",
            });
          try {
            const mapped = mapConsultorioTexto(m?.data, consList);
            setConsultorioTexto(mapped);
            if (!mapped && m?.data?.consultorio_id) {
              try {
                const consDet = await apiRequest(`/consultorios/${m.data.consultorio_id}`);
                if (consDet && (consDet.numero || consDet.ubicacion)) {
                  setConsultorioTexto(
                    `Consultorio N° ${consDet.numero}${consDet.ubicacion ? ` - ${consDet.ubicacion}` : ""}`
                  );
                } else {
                  setConsultorioTexto(`Consultorio N° ${m.data.consultorio_id}`);
                }
              } catch (e2) {
                console.log("Perfil medico consultorio fetch error:", e2);
                setConsultorioTexto(`Consultorio N° ${m.data.consultorio_id}`);
              }
            }
          } catch (e) {
            console.log("Perfil medico consultorio text error:", e);
          }
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        Alert.alert("Error", "No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    try {
      if (!user) return Alert.alert("Error", "Usuario no cargado");

      const tipo = user?.tipo || user?.role; 

      const splitName = (full) => {
        if (!full) return { first: "", last: "" };
        const parts = full.trim().split(/\s+/);
        const first = parts.shift() || "";
        const last = parts.join(" ");
        return { first, last };
      };

      let payload = { tipo };
      if (tipo === "user") {
        payload = {
          ...payload,
          name: userInfo.name || undefined,
          email: userInfo.email || undefined,
          password: userInfo.password || undefined,
        };
      } else if (tipo === "paciente") {
        const { first, last } = splitName(userInfo.name);
        payload = {
          ...payload,
          nombre: pacienteData.nombre || first || undefined,
          apellido: pacienteData.apellido || last || undefined,
          email: userInfo.email || pacienteData.email || undefined,
          password: userInfo.password || undefined,
          documento: pacienteData.documento || undefined,
          telefono: pacienteData.telefono || undefined,
          direccion: pacienteData.direccion || undefined,
          fecha_nacimiento: pacienteData.fecha_nacimiento || undefined,
        };
      } else if (tipo === "medico") {
        const { first, last } = splitName(userInfo.name);
        payload = {
          ...payload,
          nombre_m: medicoData.nombre_m || first || undefined,
          apellido_m: medicoData.apellido_m || last || undefined,
          email: userInfo.email || medicoData.email || undefined,
          password: userInfo.password || undefined,
          edad: medicoData.edad || undefined,
          telefono: medicoData.telefono || undefined,
        };
      }

      const result = await apiRequest("/perfil", "PUT", payload);

      try {
        const me = await apiRequest("/me");
        const currentUser = me.user || me;
        const roleOrTipo = currentUser?.tipo || currentUser?.role;
        const normalizedUser = { ...currentUser, role: roleOrTipo };
        setUser(normalizedUser);
        setUserInfo({
          name: normalizedUser.name || "",
          email: normalizedUser.email || "",
          password: "",
        });
        if (normalizedUser.role === "paciente") {
          const p = await apiRequest(
            `/pacientePorEmail/${encodeURIComponent(normalizedUser.email)}`
          );
          if (p.success) setPacienteData(p.data);
        }
        if (normalizedUser.role === "medico") {
          const m = await apiRequest(
            `/medicoPorEmail/${encodeURIComponent(normalizedUser.email)}`
          );
          if (m.success)
            setMedicoData({
              ...m.data,
              especialidad_id: m.data.especialidad_id?.toString() || "",
            });
          try {
            const mapped = mapConsultorioTexto(m?.data, consultorios);
            setConsultorioTexto(mapped);
            if (!mapped && m?.data?.consultorio_id) {
              try {
                const consDet = await apiRequest(`/consultorios/${m.data.consultorio_id}`);
                if (consDet && (consDet.numero || consDet.ubicacion)) {
                  setConsultorioTexto(
                    `Consultorio N° ${consDet.numero}${consDet.ubicacion ? ` - ${consDet.ubicacion}` : ""}`
                  );
                } else {
                  setConsultorioTexto(`Consultorio N° ${m.data.consultorio_id}`);
                }
              } catch (e2) {
                console.log("Perfil refresh consultorio fetch error:", e2);
                setConsultorioTexto(`Consultorio N° ${m.data.consultorio_id}`);
              }
            }
          } catch (e) {
            console.log("Perfil refresh consultorio text error:", e);
          }
        }
      } catch (refreshErr) {
        console.log("Perfil refresh error:", refreshErr);
      }

      Alert.alert("Éxito", result?.message || "Perfil actualizado con éxito");
      setEditing(false);
    } catch (err) {
      console.error("Perfil handleSave error:", err);
      if (err.status === 422 && err.details && err.details.errors) {
        const messages = Object.entries(err.details.errors)
          .map(([field, msgs]) => `• ${field}: ${[].concat(msgs).join(", ")}`)
          .join("\n");
        Alert.alert("Errores de validación", messages || "Verifica los campos");
      } else {
        Alert.alert(
          "Error",
          err?.message || "No se pudo guardar la información"
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
  await apiRequest("/logout", "POST");
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b2c4" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://i.pinimg.com/1200x/55/f4/4f/55f44f72c699b296c43ca80743dc3173.jpg",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <Text style={styles.sectionTitle}>Datos de Usuario</Text>

          {[
            { label: "Nombre de usuario", key: "name" },
            { label: "Correo electrónico", key: "email" },
          ].map((f) => {
            const isNameField = f.key === "name";
            const restrictName = user?.role === "paciente" || user?.role === "medico";
            const fieldEditable = editing && !(isNameField && restrictName);
            return (
              <View key={f.key}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  editable={fieldEditable}
                  style={[styles.input, (!fieldEditable) && styles.readOnly]}
                  value={userInfo[f.key]}
                  onChangeText={(v) => setUserInfo({ ...userInfo, [f.key]: v })}
                />
              </View>
            );
          })}

          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            editable={editing}
            secureTextEntry
            placeholder="•••••••"
            style={[styles.input, !editing && styles.readOnly]}
            value={userInfo.password}
            onChangeText={(v) => setUserInfo({ ...userInfo, password: v })}
          />

          {user.role === "paciente" && (
            <>
              <Text style={styles.sectionTitle}>Datos del Paciente</Text>
              {Object.entries({
                nombre: "Nombre",
                apellido: "Apellido",
                documento: "Documento",
                telefono: "Teléfono",
                direccion: "Dirección",
                fecha_nacimiento: "Fecha de nacimiento",
              }).map(([key, label]) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    editable={editing}
                    style={[styles.input, !editing && styles.readOnly]}
                    value={pacienteData[key] || ""}
                    onChangeText={(v) =>
                      setPacienteData({ ...pacienteData, [key]: v })
                    }
                  />
                </View>
              ))}
            </>
          )}

          {user.role === "medico" && (
            <>
              <Text style={styles.sectionTitle}>Datos del Médico</Text>

              {Object.entries({
                nombre_m: "Nombre",
                apellido_m: "Apellido",
                edad: "Edad",
                telefono: "Teléfono",
              }).map(([key, label]) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    editable={editing}
                    style={[styles.input, !editing && styles.readOnly]}
                    value={medicoData[key] || ""}
                    onChangeText={(v) =>
                      setMedicoData({ ...medicoData, [key]: v })
                    }
                  />
                </View>
              ))}

              <Text style={styles.label}>Especialidad</Text>
              <TextInput
                editable={false}
                style={[styles.input, styles.readOnly]}
                value={
                  especialidades.find(
                    (e) => e.id.toString() === medicoData.especialidad_id
                  )?.nombre_e || ""
                }
              />

              <Text style={styles.label}>Consultorio</Text>
              <TextInput
                editable={false}
                style={[styles.input, styles.readOnly]}
                value={consultorioTexto}
                placeholder="Sin consultorio"
              />
            </>
          )}

          {editing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, marginRight: 8 }]}
                onPress={handleSave}
              >
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => setEditing(false)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Editar perfil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar tus datos.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffeef6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#e38ea8", marginTop: 10 },
  panel: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 25 },
  name: { fontSize: 22, fontWeight: "bold", color: "#e38ea8" },
  role: { fontSize: 15, color: "#f2a9c9" },
  sectionTitle: {
    fontSize: 18,
    color: "#e38ea8",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  label: { fontSize: 14, color: "#c77d94", marginBottom: 4 },
  input: {
    backgroundColor: "#fff6fa",
    borderWidth: 1,
    borderColor: "#fbd6e3",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    color: "#444",
  },
  readOnly: { backgroundColor: "#f9f9f9", color: "#666" },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d67693ff",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#cc3366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: { textAlign: "center", color: "#d87093", fontSize: 16 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#f7b2c4",
    marginBottom: 12,
    backgroundColor: "#ffeef6",
  },
  pickerContainer: {
    backgroundColor: "#fff6fa",
    borderWidth: 1,
    borderColor: "#fbd6e3",
    borderRadius: 15,
    marginBottom: 10,
  },
  picker: { height: 50, color: "#444" },
});
