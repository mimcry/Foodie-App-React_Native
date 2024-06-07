import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { FoodCard, FoodTitle } from "../Global";
import ipAddress from '../Global';

const Popular = () => {
  const [loading, setLoading] = useState(true);
  const [popularFoods, setPopularFoods] = useState([]);

  useEffect(() => {
    fetchPopularFood();
  }, []);

  const fetchPopularFood = async () => {
    try {
      const response = await fetch(`http://192.168.1.66:9002/popular-food`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPopularFoods(data);
      setLoading(false);
      console.log("Popular foods count:", popularFoods);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch popular food items.");
      console.error("Failed to fetch popular food items:", error);
      setLoading(false);
    }
  };

  return (
    <View>
      <FoodTitle Topic="Popular" Title="Foods" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", marginTop: "5%" }}>
        {popularFoods.map((item, index) => (
          <FoodCard
            key={index}
            image={item.image}
            name={item.name}
            price={item.price}
            item={item}
            description={item.description}
            id={item.id}
            offer={item.offer}
            offerPer={item.offerPer}
            sides={item.sides}
            drinks={item.drinks}
            ingredients={item.ingredients}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Popular;
