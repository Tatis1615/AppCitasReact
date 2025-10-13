import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarConsultoriosMedico from "../../Screen/Consultorios/listarConsultorioMedico";

const Stack = createStackNavigator();

export default function ConsultoriosStackMedico() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarConsultoriosMedico"
        component={ListarConsultoriosMedico}
        options={{ title: "Listado de Consultorios" }}
      />
    </Stack.Navigator>
  );
}
