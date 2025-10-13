import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarEspecialidades from "../../Screen/Especialidades/listarEspecialidadPaciente";

const Stack = createStackNavigator();

export default function EspecialidadesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarEspecialidades"
        component={ListarEspecialidades}
        options={{ title: "Listado de Especialidades" }}
      />
    </Stack.Navigator>
  );
}
