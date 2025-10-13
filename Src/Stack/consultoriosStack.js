import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListarConsultorios from "../../Screen/Consultorios/listarConsultorio";
import CrearConsultorio from "../../Screen/Consultorios/crearConsultorio";
import DetalleConsultorio from "../../Screen/Consultorios/detalleConsultorio";
import EditarConsultorio from "../../Screen/Consultorios/editarConsultorio";

const Stack = createStackNavigator();

export default function ConsultoriosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarConsultorios"
        component={ListarConsultorios}
        options={{ title: "Listado de Consultorios" }}
      />
      <Stack.Screen
        name="CrearConsultorio"
        component={CrearConsultorio}
        options={{ title: "Crear Consultorio" }}
      />
      <Stack.Screen
        name="DetalleConsultorio"
        component={DetalleConsultorio}
        options={{ title: "Detalle del Consultorio" }}
      />
      <Stack.Screen
        name="EditarConsultorio"
        component={EditarConsultorio}
        options={{ title: "Editar Consultorio" }}
      />
    </Stack.Navigator>
  );
}
