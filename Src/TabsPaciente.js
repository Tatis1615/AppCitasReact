import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import InicioStackPaciente from "./Stack/inicioStackPaciente";
import PerfilStack from "./Stack/perfilStack";
import CitasStackPaciente from "./Stack/citasStackPaciente";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "InicioPaciente") iconName = "home-outline";
          else if (route.name === "CitasPaciente") iconName = "calendar-outline";
          else if (route.name === "Perfil") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#c77d94",
        tabBarInactiveTintColor: "pink",
      })}
    >
      <Tab.Screen 
        name="InicioPaciente" 
        component={InicioStackPaciente} 
        options={{ headerShown: false,
        title: "Inicio" }} 
      />
      <Tab.Screen 
        name="CitasPaciente" 
        component={CitasStackPaciente} 
        options={{ headerShown: false, 
      title: "Gestión de citas" }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilStack} 
        options={{ headerShown: false, title: "Perfil usuario" }} 
      />
    </Tab.Navigator>
  );
}
