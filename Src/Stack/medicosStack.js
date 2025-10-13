import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarMedicos from "../../Screen/Medicos/listarMedico";
import CrearMedico from "../../Screen/Medicos/crearMedico";
import DetalleMedico from "../../Screen/Medicos/detalleMedico";
import EditarMedico from "../../Screen/Medicos/editarMedico";

const Stack = createStackNavigator();

export default function MedicosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarMedicos"
        component={ListarMedicos}
        options={{ title: "Listado de Médicos" }}
      />
      <Stack.Screen
        name="CrearMedico"
        component={CrearMedico}
        options={{ title: "Crear Médico" }}
      />
      <Stack.Screen
        name="DetalleMedico"
        component={DetalleMedico}
        options={{ title: "Detalle del Médico" }}
      />
      <Stack.Screen
        name="EditarMedico"
        component={EditarMedico}
        options={{ title: "Editar Médico" }}
      />
    </Stack.Navigator>
  );
}
