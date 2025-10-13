import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import InicioPaciente from "../../Screen/Inicio/inicioPaciente"; 

import MedicosStack from "./medicosStackPaciente";
import EspecialidadesStack from "./especialidadesStackPaciente"
import CitasStackPaciente from "./citasStackPaciente";

const Stack = createStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioPaciente" 
        component={InicioPaciente} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="Medicos" 
        component={MedicosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CitasPaciente" 
        component={CitasStackPaciente} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}