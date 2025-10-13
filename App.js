import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importar pantallas
import Login from "./Screen/Auth/login";
import Registro from "./Screen/Auth/registro";
import Tabs from "./Src/Tabs";
import TabsPaciente from "./Src/TabsPaciente";
import TabsMedico from "./Src/TabsMedico";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ title: "Registro" }}
        />
        <Stack.Screen 
          name="Inicio" 
          component={Tabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="InicioPaciente" 
          component={TabsPaciente} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="InicioMedico" 
          component={TabsMedico} 
          options={{ headerShown: false }} 
        />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
