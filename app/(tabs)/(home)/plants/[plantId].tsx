import { PlantlyButton } from "@/component/PlantlyButton";
import { PlantlyImage } from "@/component/PlantlyImage";
import { usePlantStore } from "@/store/plantsStore";
import { theme } from "@/theme";
import { differenceInCalendarDays, format } from "date-fns";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const fullDateFormat = "LLL d yyyy, h:mm aaa";

export default function PlantDetails() {
  const router = useRouter();
  const waterPlant = usePlantStore((store) => store.waterPlant);
  const removePlant = usePlantStore((store) => store.removePlant);
  const params = useLocalSearchParams();
  const plantId = params.plantId;
  const plant = usePlantStore((state) =>
    state.plants.find((plant) => String(plant.id) === plantId),
  );
  const navigation = useNavigation();

  useEffect(() => {
    if (params.action === "water") {
      if (typeof plantId === "string") {
        waterPlant(plantId);
      }
    }
  }, [params.action, plantId, waterPlant]);

  useEffect(() => {
    console.log("PlantDetails mounted", plant?.id);

    navigation.setOptions({
      title: plant?.name,
    });
  }, [plant?.id, plant?.name, navigation]);

  const handleWaterPlant = () => {
    if (typeof plantId === "string") {
      waterPlant(plantId);
    }
  };

  const handleDeletePlant = () => {
    if (!plant?.id) {
      return;
    }

    Alert.alert(
      `Are you sure you want to delete ${plant?.name}?`,
      "It will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => {
            removePlant(plant.id);
            router.back();
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  if (!plant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          Plant with ID {plantId} not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={{ alignItems: "center" }}>
        <PlantlyImage imageUri={plant.imageUri} />
        <View style={styles.spacer} />
        <Text style={styles.key}>Water me every</Text>
        <Text style={styles.value}>{plant.wateringFrequencyDays} days</Text>
        <Text style={styles.key}>Last watered at</Text>
        <Text style={styles.value}>
          {plant.lastWateredAtTimestamp
            ? `${format(plant.lastWateredAtTimestamp, fullDateFormat)}`
            : "Never 😟"}
        </Text>
        <Text style={styles.key}>Days since last watered</Text>
        <Text style={styles.value}>
          {plant.lastWateredAtTimestamp
            ? differenceInCalendarDays(Date.now(), plant.lastWateredAtTimestamp)
            : "N/A"}
        </Text>
      </View>
      <PlantlyButton title="Water me!" onPress={handleWaterPlant} />
      <Pressable style={styles.deleteButton} onPress={handleDeletePlant}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  notFoundText: {
    fontSize: 18,
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: theme.colorWhite,
    flex: 1,
  },
  key: {
    marginRight: 8,
    fontSize: 16,
    color: theme.colorBlack,
    textAlign: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: theme.colorGreen,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: theme.colorGrey,
    fontWeight: "bold",
  },
  spacer: {
    height: 18,
  },
});
