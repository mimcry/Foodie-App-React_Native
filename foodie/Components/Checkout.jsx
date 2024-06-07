import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import axios from "axios";
import Cash from "./Images/cash.png";
import Global from "./Global";
import { useCart } from "react-use-cart";

const Checkout = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const { items, emptyCart } = useCart();
  const animation = useRef(null);
  const timeoutRef = useRef(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [notesTextInput, setNotesTextInput] = useState("");
  const [addressLocation, setAddressLocation] = useState("");

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://192.168.1.66:9002/addresses");
      const addresses = response.data;

      const defaultAddress = addresses.find((address) => address.isDefault);

      setSavedAddresses(addresses);
      setDefaultAddress(defaultAddress);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const calculateSubtotal = () => {
    let subtotal = 0;

    items.forEach((item) => {
      let itemPrice = item.offer
        ? item.price - (item.price * item.offerPer) / 100
        : item.price;

      subtotal += itemPrice * item.quantity;

      if (item.selectedSides && item.selectedSidesPrices) {
        item.selectedSidesPrices.forEach((sidePrice) => {
          subtotal += sidePrice;
        });
      }

      if (item.selectedDrinks && item.selectedDrinksPrices) {
        item.selectedDrinksPrices.forEach((drinkPrice) => {
          subtotal += drinkPrice;
        });
      }
    });

    return subtotal;
  };

  const cartTotal = calculateSubtotal();

  const placeOrder = async () => {
    setModalVisible(true);
  
    try {
      const orderDetails = items.map((item) => ({
        id: item.id,
        foodName: item.name,
        quantity: item.quantity,
        selectedSides: item.selectedSides,
        selectedSidesPrices: item.selectedSidesPrices,
        selectedDrinks: item.selectedDrinks,
        selectedDrinksPrices: item.selectedDrinksPrices,
        price: cartTotal,
        description: item.description,
        image: item.image,
      }));
  
      const requestData = {
        orderDetails,
        additionalNotes: notesTextInput,
        defaultAddressDetails: defaultAddress
      };
  
      console.log("Order Details:", requestData); 
      await axios.post("http://192.168.1.66:9002/order", requestData);
  
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("Home");
        emptyCart();
      }, 4000);
    } catch (error) {
      console.error("Error placing order:", error);
      setModalVisible(false);
    }
  };

  

  const renderItemDetails = (item) => (
    <View
      key={item.id}
      style={{
        padding: 5,
        backgroundColor: Global.color.backgroundcolor,
        borderRadius: 15,
        marginTop: 8,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: `${item.image}` }}
          style={{
            width: 50,
            height: 50,
            marginTop: 15,
            alignSelf: "center",
            borderRadius: 25,
          }}
        />

        <View style={{ alignSelf: "center", marginLeft: "auto" }}>
          <View style={{ padding: 5, width: 280, paddingRight: 7 }}>
            <Text
              style={{
                fontSize: Global.fontSize.small,
                fontWeight: "900",
              }}
            >
              {item.name}
            </Text>
            {Object.keys(item.selectedSides).length !== 0 ? (
              <Text style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "700" }}>Sides: </Text>
                {item.selectedSides.map((side, index) => (
                  <Text key={index}>
                    {side}
                    {index < item.selectedSides.length - 1 ? ", " : ""}
                  </Text>
                ))}
              </Text>
            ) : null}
            {Object.keys(item.selectedDrinks).length !== 0 ? (
              <Text style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <Text style={{ fontWeight: "700" }}>Drinks: </Text>
                {item.selectedDrinks.map((drink, index) => (
                  <Text key={index}>
                    {drink}
                    {index < item.selectedDrinks.length - 1 ? ", " : ""}
                  </Text>
                ))}
              </Text>
            ) : null}
            <Text style={{ fontWeight: "700" }}>Quantity: {item.quantity}</Text>
          </View>
        </View>
      </View>

      <Text
        style={{
          marginLeft: "auto",
          paddingRight: 10,
          fontWeight: "bold",
          marginTop: -10,
        }}
      >
        Rs.{" "}
        {item.offer
          ? item.price - (item.price * item.offerPer) / 100
          : item.price}
      </Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          marginTop: 25,
          paddingBottom: 0,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("mycart")}
        >
          <Icon name="arrow-left" size={25} color={"#df2020"} />
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            flex: 1,
            lineHeight: 25,
            fontSize: Global.fontSize.large,
            fontWeight: "bold",
            color: Global.color.global,
          }}
        >
          Checkout
        </Text>
      </View>
      <ScrollView style={{ padding: 20 }}>
        <View
          style={{
            borderBottomWidth: 4,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: Global.fontSize.medium,
              fontWeight: "bold",
            }}
          >
            Delivery to:
          </Text>
          {defaultAddress ? (
            <>
              <View style={{ flexDirection: "row" }}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    <Icon
                      name="map-pin"
                      color={Global.color.global}
                      size={25}
                    />
                    <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                      {" "}
                      {defaultAddress.region}, {defaultAddress.area},{" "}
                      {defaultAddress.landmark}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <Icon
                      name="phone"
                      color={Global.color.global}
                      size={25}
                      style={{ marginTop: 5 }}
                    />
                    <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                      {defaultAddress.mobileNumber}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: Global.color.backgroundcolor,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignSelf: "center",
                    marginTop: 20,
                    marginLeft: "auto",
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    Default
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text>Plaese add your address</Text>
          )}
          <Button
            onPress={() =>
              navigation.navigate(
                defaultAddress ? "myaddress" : "billing address"
              )
            }
            mode="contained"
            style={{
              backgroundColor: "#df2020",
              width: "47%",
              marginTop: "5%",
              alignSelf: "center",
            }}
            labelStyle={{ fontSize: Global.fontSize.small }}
          >
            <Icon name="plus" size={18} color={"white"} /> Add address
          </Button>
        </View>

        <View style={{ marginTop: 15 }}>
          {items.map((item) => renderItemDetails(item))}

          <View
            style={{
              borderTopWidth: 4,
              borderTopColor: "gray",
              marginTop: "5%",
            }}
          >
            <Text
              style={{
                fontSize: Global.fontSize.medium,
                fontWeight: "bold",
                marginTop: "2%",
              }}
            >
              Payment Method
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                marginTop: "5%",
                maxWidth: 180,
                maxHeight: 60,
                flexDirection: "row",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Image
                source={Cash}
                style={{
                  objectFit: "contain",
                  width: 50,
                  height: 50,
                  resizeMode: "contain",
                }}
              />

              <Text style={{ alignSelf: "center", marginLeft: "5%" }}>
                Cash on delivery
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 4,
              borderTopColor: "gray",
              marginTop: "5%",
            }}
          >
            <Text
              style={{
                fontSize: Global.fontSize.medium,
                fontWeight: "bold",
                marginTop: "2%",
              }}
            >
              Add notes
            </Text>
            <View
              style={{
                marginTop: "5%",
                maxWidth: 180,
                maxHeight: 60,
                flexDirection: "row",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <TextInput
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  width: 340,
                  paddingLeft: 10,
                  borderRadius: 10,
                  height: 70,
                  marginTop: -15,
                }}
                placeholder="Don't ring the bell please knock the door"
                value={notesTextInput}
                onChangeText={(text) => setNotesTextInput(text)}
              />
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 4,
              borderTopColor: "gray",
              marginTop: "5%",
            }}
          >
            <Text
              style={{
                fontSize: Global.fontSize.medium,
                fontWeight: "bold",
                marginTop: "2%",
              }}
            >
              Order Summary
            </Text>
            <View style={{ marginTop: "2%" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ alignSelf: "center", lineHeight: 25 }}>
                  Items Total
                </Text>
                <Text style={{ alignSelf: "center", marginLeft: "auto" }}>
                  Rs. {cartTotal}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ alignSelf: "center", lineHeight: 25 }}>
                  Delivery Fee
                </Text>
                <Text style={{ alignSelf: "center", marginLeft: "auto" }}>
                  Rs 20
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ alignSelf: "center", lineHeight: 25 }}>
                  Total Payment
                </Text>
                <Text style={{ alignSelf: "center", marginLeft: "auto" }}>
                  Rs.{cartTotal + 20}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 20,
              borderTopColor: "gray",
              marginTop: "5%",
              flexDirection: "row",
            }}
          >
            <View style={{ marginTop: "5%" }}>
              <Text
                style={{
                  fontSize: Global.fontSize.medium,
                  fontWeight: "500",
                  marginTop: "2%",
                  flexDirection: "row",
                }}
              >
                Total:
                <Text style={{ color: "#df2020" }}> Rs.{cartTotal + 20}</Text>
              </Text>
              <Text style={{ marginLeft: "5%", marginBottom: 120 }}>
                All tax included
              </Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <Button
                mode="contained"
                onPress={placeOrder}
                style={{
                  backgroundColor: "#df2020",
                  marginTop: "15%",
                  marginBottom: 50,
                  padding: 5,
                }}
              >
                Place Order
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: "#e6ffe6",
            }}
          >
            <LottieView
              source={require("./Images/confirm.json")}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
              ref={animation}
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              Order Confirmed!
            </Text>
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              Thank you for your order. Your food is being prepared and will be
              delivered soon.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;
