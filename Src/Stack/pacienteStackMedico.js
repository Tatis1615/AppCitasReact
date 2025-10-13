import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarPacientesMedico from "../../Screen/Pacientes/listarPacienteMedico";
import DetallePacienteMedico from "../../Screen/Pacientes/detallePacienteMedico";

const Stack = createStackNavigator();

export default function PacientesStackMedico() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarPacientesMedico"
        component={ListarPacientesMedico}
        options={{ title: "Listado de Pacientes" }}
      />
      <Stack.Screen
        name="DetallePacienteMedico"
        component={DetallePacienteMedico}
        options={{ title: "Detalle del Paciente" }}
      />
    </Stack.Navigator>
  );
}
