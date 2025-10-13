import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarEspecialidadesMedico from "../../Screen/Especialidades/listarEspecialidadMedico";

const Stack = createStackNavigator();

export default function EspecialidadesStackMedico() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarEspecialidades"
        component={ListarEspecialidadesMedico}
        options={{ title: "Listado de Especialidades" }}
      />
    </Stack.Navigator>
  );
}
