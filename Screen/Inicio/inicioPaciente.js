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
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");

export default function InicioPaciente({ navigation }) {
  const [userName, setUserName] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://rautomation.es/wp-content/uploads/2023/12/especialista-biotecnologia-laboratorio-realizando-experimentos-1-1024x683.jpg",
    "https://www.nosequeestudiar.net/site/assets/files/1695520/medicina-medico-estetoscopio.jpg",
    "https://magnetosur.com/wp-content/uploads/2021/11/En-que-casos-se-debe-recurrir-a-la-medicina-general.jpg",
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
        if (response.ok) setUserName(data.user?.name || "Usuario");
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

  // Auto scroll del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleCall = async (phone) => {
    try {
      const url = `tel:${phone}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("No se puede realizar la llamada");
    } catch (err) {
      Alert.alert("Error", "No se pudo iniciar la llamada");
    }
  };

  const handleOpenWeb = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("No se puede abrir el enlace");
    } catch (err) {
      Alert.alert("Error", "No se pudo abrir el enlace");
    }
  };

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
        <Ionicons name="heart-outline" size={28} color="#e38ea8" />
        <Text style={styles.welcomeText}>¡Hola, {userName}! 💖</Text>
        <Text style={styles.subText}>
          Nos alegra verte de nuevo. Aquí podrás gestionar tus citas, conocer nuestros especialistas y más.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
        <View style={styles.serviceGrid}>
          <View style={styles.serviceItem}>
            <Ionicons name="medical-outline" size={36} color="#e38ea8" />
            <Text style={styles.serviceLabel}>Consulta General</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="flask-outline" size={36} color="#e38ea8" />
            <Text style={styles.serviceLabel}>Laboratorio</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="medkit-outline" size={36} color="#e38ea8" />
            <Text style={styles.serviceLabel}>Especialistas</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="time-outline" size={36} color="#e38ea8" />
            <Text style={styles.serviceLabel}>Horarios Flexibles</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("Especialidades", { screen: "ListarEspecialidadesPaciente" })
          }
        >
          <Ionicons name="business-outline" size={42} color="#e38ea8" />
          <Text style={styles.cardTitle}>Especialidades</Text>
          <Text style={styles.cardDesc}>Explora nuestras áreas médicas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicos", { screen: "ListarMedicos" })}
        >
          <Ionicons name="people-outline" size={42} color="#e38ea8" />
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardDesc}>Conoce a nuestros profesionales</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contáctanos</Text>

        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={24} color="#e38ea8" />
          <TouchableOpacity onPress={() => handleCall("+573165678901")}>
            <Text style={styles.contactText}>+57 316 567 8901</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={24} color="#e38ea8" />
          <Text style={styles.contactText}>Calle 123 #45-67, Bogotá</Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="globe-outline" size={24} color="#e38ea8" />
          <TouchableOpacity onPress={() => handleOpenWeb("https://vida-salud-example.com")}>
            <Text style={styles.contactText}>Visitar sitio web</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef5f8ff", },

  carouselWrapper: { height: 250, marginVertical: 10 },
  carouselImage: {
    width: width - 40,
    height: 230,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dots: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#e38ea8",
    marginHorizontal: 5,
  },

  headerCard: {
    backgroundColor: "#fee5efff",
    margin: 16,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e38ea8",
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
    color: "#e38ea8",
    marginBottom: 12,
    textAlign: "center",
  },

  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  serviceItem: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#fee5efff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceLabel: { marginTop: 8, fontSize: 14, color: "#444", textAlign: "center" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginVertical: 18,
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
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 6, color: "#333" },
  cardDesc: { fontSize: 13, color: "#777", textAlign: "center", marginTop: 4 },

  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#fee5efff",
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  contactItem: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  contactText: { marginLeft: 10, fontSize: 15, color: "#444" },
});
