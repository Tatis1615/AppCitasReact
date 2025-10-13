import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Perfil from "../../Screen/Perfil/perfil";

const Stack = createStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PerfilUsuario" 
        component={Perfil} 
        options={{ title: "Perfil de Usuario" }} 
      />
    </Stack.Navigator>
  );
}
