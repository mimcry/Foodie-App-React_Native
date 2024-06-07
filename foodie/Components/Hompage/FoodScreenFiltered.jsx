import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Global from "../Global";
import Icon from "react-native-vector-icons/AntDesign";
import { useCart } from "react-use-cart";
import { useRoute } from "@react-navigation/native";

const FoodScreenFiltered = () => {
  const route = useRoute();
  const { selectedTagName, selectedId } = route.params;
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTagId !== null) {
      fetchFoodItems();
    }
  }, [selectedTagId]);

  const fetchTags = async () => {
    try {
      const response = await fetch("http://192.168.1.66:9002/tags");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTags(data);
      console.log("Tags:", data);
      const selectedTag = data.find((tag) => tag.name === selectedTagName);
      if (selectedTag) {
        setSelectedTagId(selectedTag._id);
        console.log("selesctes", selectedTagId);
      } else {
        throw new Error("Selected tag not found");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tags data.");
      console.error("Failed to fetch tags data:", error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://192.168.1.66:9002/food");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const filteredFoodItems = data.filter(
        (item) =>
          item.tags && item.tags.find((tag) => tag._id === selectedTagId)
      );
      console.log("match", filteredFoodItems);
      setFoodItems(filteredFoodItems);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food items data.");
      console.error("Failed to fetch food items data:", error);
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  const home = () => {
    navigation.navigate("Home");
  };

  const { addItem } = useCart();

  const onPressItem = (item) => {
    navigation.navigate("fooddescription", {
      item,
      offer: item.offer,
      offerPer: item.offerPer,
    });
  };

  const renderFoodItem = ({ item, index }) => (
    <View
      key={index}
      style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <Image
        source={{ uri: `${item.image}` }}
        style={{ width: 100, height: 100, borderRadius: 20 }}
      />
      {item.offer && (
        <View
          style={{
            position: "absolute",
            borderTopLeftRadius: 25,
            backgroundColor: "red",
            paddingVertical: 2,
            paddingHorizontal: 5,
            borderRadius: 5,
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          <Text style={{ color: "white" }}>{item.offerPer}% Off</Text>
        </View>
      )}
      <View style={{ alignSelf: "center", marginLeft: "auto", width: 230 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontSize: 14 }}>{item.description}</Text>
        {item.offerPer ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ textDecorationLine: "line-through" }}>
              {" "}
              Rs.{item.price}
            </Text>
            <Text style={{ color: "green", marginLeft: 5 }}>
              Rs.{item.price - (item.price * item.offerPer) / 100}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "green" }}>Rs. {item.price}</Text>
        )}
        <TouchableOpacity onPress={() => onPressItem(item)}>
          <View
            style={{
              backgroundColor: Global.color.global,
              width: "35%",
              color: "white",
              marginTop: "2%",
              flexDirection: "row",
              padding: 8,
              borderRadius: 25,
              paddingLeft: 10,
            }}
          >
            <Text style={{ color: "white" }}>Add to</Text>
            <Icon name="shoppingcart" size={18} color={"white"} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const mapImage = {
    Pizza:
      "https://t3.ftcdn.net/jpg/05/60/70/82/360_F_560708240_pMZPOuSfvblWGRoaiZFLT4wiFTzQPwQe.jpg",
    Fastfood:
      "https://static.vecteezy.com/system/resources/previews/037/245/808/non_2x/ai-generated-beautuful-fast-food-background-with-copy-space-free-photo.jpg",
    Momo: "https://5.imimg.com/data5/SELLER/Default/2022/11/CU/KH/BA/135440240/frozen-periperi-chicken-momos-500x500.JPG",
    Coffee:
      "https://www.shutterstock.com/image-photo/coffee-cup-beans-on-old-600nw-547416751.jpg",
    Noodles:
      "https://www.meviveinternational.com/data/storage/app/images/application/noodles-app-2819.webp",
    Breakfast:
      "https://t4.ftcdn.net/jpg/03/25/36/85/360_F_325368585_3PrfqAiwiyDzOmMpVYCbsZEoR6EzGkA9.jpg",
  };

  const imageURL = mapImage[selectedTagName];

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Image
        source={{ uri: imageURL }}
        style={{
          width: 400,
          height: 200,
          resizeMode: "cover",
          position: "absolute",
        }}
      />
      <TouchableOpacity activeOpacity={0.5} onPress={home}>
        <Icon
          name="arrowleft"
          size={25}
          color={"white"}
          style={{ padding: 20, marginTop: 25 }}
        />
      </TouchableOpacity>
      <Text
        style={{
          position: "relative",
          zIndex: 2,
          color: Global.color.global,
          alignSelf: "center",
          fontSize: Global.fontSize.large,
          fontWeight: "bold",
          backgroundColor: "white",
          padding: 8,
          borderTopLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        Choose Your {selectedTagName}
      </Text>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.name}
        renderItem={renderFoodItem}
        style={{ marginTop: "15%" }}
      />
    </View>
  );
};

export default FoodScreenFiltered;
