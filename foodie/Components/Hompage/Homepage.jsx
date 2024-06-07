import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Featured_Food from "./Featured_Food";
import Popular from "./Popular";
import OfferCard from "./OfferCard";
import Global from "../Global";

const Homepage = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchFoodData();
    fetchTagData();
  }, []);
  
  const fetchFoodData = () => {
    fetch("http://192.168.1.66:9002/food")
      .then((response) => response.json())
      .then((data) => {
        setFoodItems(data);
        setFilteredFoodItems(data);
      })
      .catch((error) => console.error("Error fetching food data:", error));
  };

  const fetchTagData = () => {
    fetch("http://192.168.1.66:9002/tags")
      .then((response) => response.json())
      .then((data) => {
        setTags(data);
        console.log("id",tags.id)
      })
      .catch((error) => console.error("Error fetching tags:", error));
      
  };

  const navigateToFood = (name, _id) => {
    console.log("Selected Tag ID:",name );
 
    navigation.navigate("foodscreen", { selectedId: _id, selectedTagName: name });
  };
  

  const onPressItem = (item) => {
    navigation.navigate("fooddescription", {
      item,
      offer: item.offer,
      offerPer: item.offerPer,
    });
  };

  const renderTagSelection = () => {
    return (
      <FlatList
        data={tags}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToFood(item.name,item._id)}>
            <Image
              source={{ uri: item.image }}
              style={{ objectFit: "contain", width: 60, height: 60 }}
            />
            <Text style={{ alignSelf: "center" }}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 10 }}
      />
    );
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredItems = foodItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFoodItems(filteredItems);

      const suggestionItems = foodItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(suggestionItems);
    } else {
      setFilteredFoodItems(foodItems);
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredFoodItems(foodItems);
    setSuggestions([]);
  };

  const renderFoodItem = ({ item }) => (
    <View
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
      <View style={{ alignSelf: "center", marginLeft: 20, width: 230 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontSize: 14 }}>{item.description}</Text>
        {item.offerPer ? (
            <View style={{flexDirection:"row"}}>
              <Text  style={{textDecorationLine:"line-through"}}> Rs.{item.price}</Text>
              <Text style={{ color: "green",marginLeft:5}}>
              Rs.{item.price - (item.price * item.offerPer) / 100}
          </Text></View>
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

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 10, flexDirection: 'row', alignItems: 'center', }}
      onPress={() => handleSearch(item.name)}
    >
      <Image
        source={{ uri: `${item.image}` }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20, }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 25,
            backgroundColor: "#f7e3e1",
            paddingLeft: 50,
            paddingRight: 10,
            height: 50,
            marginLeft: 0,
          }}
        >
          <TextInput
            style={{ color: "black", marginTop: 10, width: 290 }}
            placeholder="Search for your meal"
            placeholderTextColor="black"
            onChangeText={handleSearch}
            value={searchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={clearSearch}>
              <Icon
                name="closecircle"
                size={20}
                style={{
                  position: "absolute",
                  right: 10,
                  top: -22,
                  color:(Global.color.global)
                }}
              />
            </TouchableOpacity>
          )}
          <Icon
            name="search1"
            size={20}
            style={{
              position: "absolute",
              left: 20,
              top: 15,
              tintColor: "white",
            }}
          />
        </View>
      </View>
      {searchQuery ? (
        <>
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSuggestionItem}
              style={{ backgroundColor: "#f7e3e1", marginTop: 5, borderRadius: 25 }}
            />
          )}
          {filteredFoodItems.length > 0 ? (
            <FlatList
              data={filteredFoodItems}
              keyExtractor={(item) => item.name}
              renderItem={renderFoodItem}
              style={{ marginTop: "3%" }}
            />
          ) : (
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#df2020" }}>
                Sorry, we couldn't find your food
              </Text>
            </View>
          )}
        </>
      ) : (
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 26,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#df2020",
                }}
              >
                GETTING HUNGRY?
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                FOODIE{" "}
                <Text
                  style={{ fontSize: 30, color: "#df2020", fontWeight: "bold" }}
                >
                  delivers at
                </Text>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {" "}
                  your door
                </Text>
              </Text>

              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                {renderTagSelection()}
              </View>

              <Featured_Food />
              <Popular />
              <OfferCard />
            </>
          }
          renderItem={null}
        />
      )}
    </View>
  );
};

export default Homepage;
