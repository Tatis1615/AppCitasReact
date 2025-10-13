import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import InicioStack from "./Stack/inicioStack";
import PerfilStack from "./Stack/perfilStack";
import CitasStack from "./Stack/citasStack";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Inicio") iconName = "home-outline";
          else if (route.name === "Citas") iconName = "calendar-outline";
          else if (route.name === "Perfil") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#c77d94",
        tabBarInactiveTintColor: "pink",
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={InicioStack} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Citas" 
        component={CitasStack} 
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
