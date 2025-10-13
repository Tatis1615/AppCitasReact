import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarEspecialidades from "../../Screen/Especialidades/listarEspecialidad";
import CrearEspecialidad from "../../Screen/Especialidades/crearEspecialidad";
import DetalleEspecialidad from "../../Screen/Especialidades/detalleEspecialidad";
import EditarEspecialidad from "../../Screen/Especialidades/editarEspecialidad";

const Stack = createStackNavigator();

export default function EspecialidadesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarEspecialidades"
        component={ListarEspecialidades}
        options={{ title: "Listado de Especialidades" }}
      />
      <Stack.Screen
        name="CrearEspecialidad"
        component={CrearEspecialidad}
        options={{ title: "Crear Especialidad" }}
      />
      <Stack.Screen
        name="DetalleEspecialidad"
        component={DetalleEspecialidad}
        options={{ title: "Detalle de la Especialidad" }}
      />
      <Stack.Screen
        name="EditarEspecialidad"
        component={EditarEspecialidad}
        options={{ title: "Editar Especialidad" }}
      />
    </Stack.Navigator>
  );
}
