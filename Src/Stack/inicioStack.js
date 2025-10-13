import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import InicioMenu from "../../Screen/Inicio/inicio"; 

import PacientesStack from "./pacientesStack";
import MedicosStack from "./medicosStack";
import ConsultoriosStack from "./consultoriosStack";
import EspecialidadesStack from "./especialidadesStack";
import AdminStack from "./adminStack";
import CitasStack from "./citasStack";

const Stack = createStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenu" 
        component={InicioMenu} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Medicos" 
        component={MedicosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Consultorios" 
        component={ConsultoriosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Admin" 
        component={AdminStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Citas" 
        component={CitasStack} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}