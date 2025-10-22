import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Configuracion from "../../Screen/Configuracion/configuracionScreen";

const Stack = createStackNavigator();

export default function ConfiguracionStack() {
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