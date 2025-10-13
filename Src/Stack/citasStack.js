import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitas from "../../Screen/Citas/listarCitas";
import CrearCita from "../../Screen/Citas/crearCita";
import DetalleCita from "../../Screen/Citas/detalleCita";
import EditarCita from "../../Screen/Citas/editarCita";

const Stack = createStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarCitas"
        component={ListarCitas}
        options={{ title: "Citas Agendadas" }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCita}
        options={{ title: "Agendar Cita" }}
      />
      <Stack.Screen
        name="EditarCita"
        component={EditarCita}
        options={{ title: "Editar Cita" }}
      />
      <Stack.Screen
        name="DetalleCita"
        component={DetalleCita}
        options={{ title: "Detalle de la Cita" }}
      />
    </Stack.Navigator>
  );
}
