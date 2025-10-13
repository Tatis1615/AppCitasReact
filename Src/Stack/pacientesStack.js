import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarPacientes from "../../Screen/Pacientes/listarPaciente";
import CrearPaciente from "../../Screen/Pacientes/crearPaciente";
import DetallePaciente from "../../Screen/Pacientes/detallePaciente";
import EditarPaciente from "../../Screen/Pacientes/editarPaciente";

const Stack = createStackNavigator();

export default function PacientesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarPacientes"
        component={ListarPacientes}
        options={{ title: "Listado de Pacientes" }}
      />
      <Stack.Screen
        name="CrearPaciente"
        component={CrearPaciente}
        options={{ title: "Crear Paciente" }}
      />
      <Stack.Screen
        name="DetallePaciente"
        component={DetallePaciente}
        options={{ title: "Detalle del Paciente" }}
      />
      <Stack.Screen
        name="EditarPaciente"
        component={EditarPaciente}
        options={{ title: "Editar Paciente" }}
      />
    </Stack.Navigator>
  );
}
