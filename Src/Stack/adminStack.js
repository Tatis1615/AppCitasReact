import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarAdmin from "../../Screen/Admin/listarAdmin";
import CrearAdmin from "../../Screen/Admin/crearAdmin";
import DetalleAdmin from "../../Screen/Admin/detalleAdmin";
import EditarAdmin from "../../Screen/Admin/editarAdmin";

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name="ListarAdmin"
            component={ListarAdmin}
            options={{ title: "Administradores" }}
        />
        <Stack.Screen
            name="CrearAdmin"
            component={CrearAdmin}
            options={{ title: "Crear Administrador" }}
        />
        <Stack.Screen
            name="EditarAdmin"
            component={EditarAdmin}
            options={{ title: "Editar Administrador" }}
        />
        <Stack.Screen
            name="DetalleAdmin"
            component={DetalleAdmin}
            options={{ title: "Detalle del Administrador" }}
        />
    </Stack.Navigator>
  );
}
