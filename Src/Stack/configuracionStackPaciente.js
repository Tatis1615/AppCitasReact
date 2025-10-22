import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Configuracion from "../../Screen/Configuracion/configuracionPaciente";

const Stack = createStackNavigator();

export default function ConfiguracionStackPaciente() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Configuraciónn"
        component={Configuracion}
        options={{ title: "Ajustes" }}
      />
    </Stack.Navigator>
  );
}