import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Modal, Pressable, FlatList } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Dish, dishes } from "./data/dishes";
import DishCard from "./components/DishCard";
import CategorySelector from "./components/CategorySelector";
import { getPricesForIngredient } from "./services/priceService";

export default function App() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const [priceModal, setPriceModal] = useState<{ ingredient: string; prices: Record<string, number> } | null>(null);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      if (selectedCuisine && d.cuisine !== selectedCuisine) return false;
      if (selectedSubcategory && !d.subcategories.includes(selectedSubcategory)) return false;
      return true;
    });
  }, [selectedCuisine, selectedSubcategory]);

  const onSwipedRight = (index: number) => {
    const dish = filtered[index];
    if (dish) setOpenDish(dish);
  };

  const onRequestPriceCompare = async (ingredient: string) => {
    const prices = await getPricesForIngredient(ingredient);
    setPriceModal({ ingredient, prices });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Middagsidé — Swipe för recept</Text>

      <CategorySelector
        cuisines={[...new Set(dishes.map((d) => d.cuisine))]}
        subcategories={[...new Set(dishes.flatMap((d) => d.subcategories))]}
        selectedCuisine={selectedCuisine}
        selectedSubcategory={selectedSubcategory}
        onSelectCuisine={(c) => {
          setSelectedCuisine((prev) => (prev === c ? null : c));
          setCurrentIndex(0);
        }}
        onSelectSubcategory={(s) => {
          setSelectedSubcategory((prev) => (prev === s ? null : s));
          setCurrentIndex(0);
        }}
      />

      <View style={styles.swiperContainer}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>Inga rätter för de valda filtren</Text>
        ) : (
          <Swiper
            cards={filtered}
            cardIndex={currentIndex}
            renderCard={(card) => <DishCard dish={card} />}
            onSwiped={() => setCurrentIndex((i) => i + 1)}
            onSwipedRight={onSwipedRight}
            onSwipedLeft={() => {}}
            backgroundColor={"transparent"}
            stackSize={3}
          />
        )}
      </View>

      <Modal visible={!!openDish} animationType="slide" onRequestClose={() => setOpenDish(null)}>
        {openDish && (
          <SafeAreaView style={styles.modal}>
            <Text style={styles.modalTitle}>{openDish.name}</Text>
            <Text style={styles.modalSubtitle}>
              {openDish.cuisine} • {openDish.subcategories.join(", ")}
            </Text>
            <Text style={styles.sectionTitle}>Ingredienser:</Text>
            <FlatList
              data={openDish.ingredients}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.ingredientRow}
                  onPress={() => onRequestPriceCompare(item)}
                >
                  <Text style={styles.ingredientText}>{item}</Text>
                  <Text style={styles.hint}>Jämför priser</Text>
                </Pressable>
              )}
            />
            <Text style={styles.sectionTitle}>Receptlänk:</Text>
            <Text style={styles.link}>{openDish.recipeUrl}</Text>

            <Pressable style={styles.closeButton} onPress={() => setOpenDish(null)}>
              <Text style={styles.closeText}>Stäng</Text>
            </Pressable>
          </SafeAreaView>
        )}
      </Modal>

      <Modal visible={!!priceModal} animationType="fade" onRequestClose={() => setPriceModal(null)}>
        {priceModal && (
          <SafeAreaView style={styles.modal}>
            <Text style={styles.modalTitle}>Prisjämförelse: {priceModal.ingredient}</Text>
            <FlatList
              data={Object.entries(priceModal.prices)}
              keyExtractor={([store]) => store}
              renderItem={({ item: [store, price] }) => (
                <View style={styles.priceRow}>
                  <Text style={styles.store}>{store}</Text>
                  <Text style={styles.price}>{price.toFixed(2)} kr</Text>
                </View>
              )}
            />
            <Pressable style={styles.closeButton} onPress={() => setPriceModal(null)}>
              <Text style={styles.closeText}>Stäng</Text>
            </Pressable>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  swiperContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#666" },
  modal: { flex: 1, padding: 16 },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  modalSubtitle: { marginBottom: 12, color: "#666" },
  sectionTitle: { marginTop: 12, fontWeight: "600" },
  link: { color: "blue", marginTop: 6 },
  closeButton: { marginTop: 20, padding: 12, backgroundColor: "#333", borderRadius: 8, alignItems: "center" },
  closeText: { color: "#fff", fontWeight: "600" },
  ingredientRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#eee" },
  ingredientText: {},
  hint: { color: "#007aff" },
  priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#eee" },
  store: { fontWeight: "500" },
  price: {}
});