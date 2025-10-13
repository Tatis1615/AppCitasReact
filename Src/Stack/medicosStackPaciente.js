import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarMedicosPaciente from "../../Screen/Medicos/listarMedicoPaciente";
import DetalleMedicoPaciente from "../../Screen/Medicos/detalleMedicoPaciente";

const Stack = createStackNavigator();

export default function MedicosStackPaciente() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarMedicosPaciente"
        component={ListarMedicosPaciente}
        options={{ title: "Listado de Médicos" }}
      />
      <Stack.Screen
        name="DetalleMedicoPaciente"
        component={DetalleMedicoPaciente}
        options={{ title: "Detalle del Médico" }}
      />
    </Stack.Navigator>
  );
}
