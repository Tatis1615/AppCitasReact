import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from 'expo-notifications';

// Importar pantallas
import Login from "./Screen/Auth/login";
import Registro from "./Screen/Auth/registro";
import Tabs from "./Src/Tabs";
import TabsPaciente from "./Src/TabsPaciente";
import TabsMedico from "./Src/TabsMedico";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true, // MUestra la notificacion como alerta
        shouldShowBanner: true, // Muestra notificacion como banner en la parte superior
        shouldPlaySound: true, // Reproduce sonido
        shouldSetBadge: false, // Cambia icono de notificacion
        shouldShowList: true,

      }),
    });

    const getPermisos = async () => {
      const { status } = await Notifications.requestPermissionsAsync(); // Acá se recibe el permiso del usuario

      if (status !== 'granted') {
        alert('Se requieren permisos para recibir notificaciones');
      }
    }
    getPermisos();
  }, []);



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
