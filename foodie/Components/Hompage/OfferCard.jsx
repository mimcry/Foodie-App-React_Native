import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FoodTitle } from "../Global";
import { FoodCard } from "../Global";
import ipAddress from '../Global'

const OfferCard = () => {
  const [offers, setOffers] = useState([]);
  const navigation = useNavigation();

  
  const fetchOffers = async () => {
    try {
   
      const response = await fetch("http://192.168.1.66:9002/food");
      const data = await response.json();
 
      const offerItems = data.filter(item => item.offer);
      setOffers(offerItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const FoodDescription = (item) => {
    navigation.navigate("fooddescription", { item });
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <FoodTitle Topic="Offer" Title="Foods" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row", marginTop: "5%" }}
      >
        {offers.map((item, index) => (
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
            onPress={() => FoodDescription(item)}
            sides={item.sides}
            drinks={item.drinks}
            ingredients={item.ingredients}
            sidesprice={item.sidesprice}
            drinkprice={item.drinkprice}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default OfferCard;
