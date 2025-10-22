import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import InicioStackMedico from "./Stack/inicioStackMedico";
import PerfilStack from "./Stack/perfilStack";
import CitasStackMedico from "./Stack/citasStackMedico";
import ConfiguracionStack from "./Stack/configuracionStack";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "InicioMedico") iconName = "home-outline";
          else if (route.name === "CitasMedico") iconName = "calendar-outline";
          else if (route.name === "Perfil") iconName = "person-outline";
          else if (route.name === "Configuración") iconName = "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#c77d94",
        tabBarInactiveTintColor: "#f8b0c6",
      })}
    >
      <Tab.Screen 
        name="InicioMedico" 
        component={InicioStackMedico} 
        options={{ headerShown: false,
        title: "Inicio" }} 
      />
      <Tab.Screen 
        name="CitasMedico" 
        component={CitasStackMedico} 
        options={{ headerShown: false, 
      title: "Gestión de citas" }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilStack} 
        options={{ headerShown: false, title: "Perfil usuario" }} 
      />
      <Tab.Screen
        name="Configuración"
        component={ConfiguracionStack}
        options={{ headerShown: false, title: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}
