import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dish } from "../data/dishes";

export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{dish.name}</Text>
      <Text style={styles.meta}>{dish.cuisine} • {dish.subcategories.join(", ")}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.info}>Protein: {dish.protein}g</Text>
        <Text style={styles.info}>Kalorier: {dish.calories}kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 420,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
    alignSelf: "center"
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  meta: { color: "#666", marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  info: { fontWeight: "600" }
});