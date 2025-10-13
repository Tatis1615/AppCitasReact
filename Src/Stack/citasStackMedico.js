import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitasMedico from "../../Screen/Citas/listarCitasMedico";
import DetalleCitaMedico from "../../Screen/Citas/detalleCitaMedico";
import EditarCitaMedico from "../../Screen/Citas/editarCitaMedico";

const Stack = createStackNavigator();

export default function CitasStackMedico() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarCitas"
        component={ListarCitasMedico}
        options={{ title: "Citas Agendadas" }}
      />
      <Stack.Screen
        name="EditarCitaMedico"
        component={EditarCitaMedico}
        options={{ title: "Editar Cita" }}
      />
      <Stack.Screen
        name="DetalleCitaMedico"
        component={DetalleCitaMedico}
        options={{ title: "Detalle de la Cita" }}
      />
    </Stack.Navigator>
  );
}
