import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");

export default function InicioMedico({ navigation }) {
  const [userName, setUserName] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://img.freepik.com/foto-gratis/cientificos-tiro-medio-posando-juntos_23-2148969982.jpg",
    "https://www.shutterstock.com/image-photo/hospital-hallway-multiethnic-medical-staff-600nw-2557673759.jpg",
    "https://www.shutterstock.com/image-photo/doctor-healthcare-medicine-patient-talking-600nw-2191880035.jpg",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserName(data.user?.name || "Doctor/a");
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Carrusel con desplazamiento automático
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderCarousel = () => (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <View key={i} style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri }} style={styles.carouselImage} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {images.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {renderCarousel()}

      <Animated.View style={[styles.headerCard, { opacity: fadeAnim }]}>
        <Ionicons name="medkit-outline" size={30} color="#cc3366" />
        <Text style={styles.welcomeText}>¡Hola, Dr(a). {userName}! 🩺</Text>
        <Text style={styles.subText}>
          Gestiona tus pacientes y consultorios fácilmente desde esta plataforma.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.dashboardSection, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Panel de gestión</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Pacientes", { screen: "ListarPacientesMedico" })
            }
          >
            <Ionicons name="people-outline" size={42} color="#e38ea8" />
            <Text style={styles.cardTitle}>Pacientes</Text>
            <Text style={styles.cardDesc}>Revisa y gestiona tus pacientes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Consultorios", { screen: "ListarConsultoriosMedico" })
            }
          >
            <Ionicons name="business-outline" size={42} color="#e38ea8" />
            <Text style={styles.cardTitle}>Consultorios</Text>
            <Text style={styles.cardDesc}>Administra tus espacios de atención</Text>
          </TouchableOpacity>

          {/** Especialidades eliminado del panel del médico **/}
        </View>
      </Animated.View>

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          “La salud del paciente es nuestra prioridad. Gracias por tu dedicación profesional.” 💗
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef5f8ff" },

  carouselWrapper: { height: 240, marginVertical: 10 },
  carouselImage: {
    width: width - 40,
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dots: {
    position: "absolute",
    bottom: 8,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#cc3366",
    marginHorizontal: 5,
  },

  headerCard: {
    backgroundColor: "#fee5efff",
    marginHorizontal: 18,
    marginVertical: 12,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#cc3366",
    marginTop: 6,
  },
  subText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#cc3366",
    marginBottom: 12,
    textAlign: "center",
  },

  dashboardSection: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  card: {
    width: "42%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    color: "#333",
  },
  cardDesc: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },

  footerCard: {
    backgroundColor: "#fee5efff",
    margin: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#cc3366",
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 14,
  },
});
