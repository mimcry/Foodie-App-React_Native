import { React, useState } from "react";
import { View, Text, Image, TouchableOpacity,Modal } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { useCart } from "react-use-cart";

import { useNavigation } from "@react-navigation/native";
export const ipAddress="http://192.168.1.66:9002"
const Global = {
  fontSize: {
    large: 26,
    medium: 20,
    small: 18,
  },
  color: {
    global: "#df2020",
    backgroundcolor: "#FFE4E4",
    gray: "gray",
  },
};
export const GlobalButton = (props) => {
  return (
    <View>
      <Button
        onPress={props.onPress}
        mode="contained"
        style={{
          padding: 10,
          backgroundColor: Global.color.global,
          marginTop: "10%",
          marginBottom: 200,
        }}
        labelStyle={{ fontSize: Global.fontSize.medium }}
      >
        {props.name}
      </Button>
    </View>
  );
};

export const FoodTitle = (props) => {
  return (
    <View>
      <Text
        style={{
          fontSize: Global.fontSize.large,
          fontWeight: "bold",
          marginTop: "5%",
        }}
      >
        {props.Topic}
        <Text style={{ color: "#df2020" }}> {props.Title}</Text>
      </Text>
    </View>
  );
};

export const FoodCard = (props) => {
  const navigation = useNavigation();

  const onPressItem = () => {
    navigation.navigate("fooddescription", {
      item: props,
      id: props.id,
      offerPer: props.offerper,
      offer: props.offer,
    });
  };

  return (
    <View>
      <View
        style={{
          maxWidth: 120,
          borderRadius: 25,
          borderWidth: 2,
          padding: 6,
          borderColor: "white",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={onPressItem}>
          <View
            style={{
              backgroundColor: "#f7e5e4",
              borderRadius: 25,
              width: 100,
              height: 90,
              position: "relative",
            }}
          >
            <Image
              source={{ uri: `${props.image}` }}
              style={{
                width: 95,

                height: 85,

                position: "absolute",
                borderRadius: 25,
                
                
              }}
            />
            {props.offer && (
              <View
                style={{
                  position: "absolute",
                  borderTopLeftRadius: 25,
                  backgroundColor: "red",
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}> {props.offerPer}% Off</Text>
              </View>
            )}
            <TouchableOpacity activeOpacity={0.5} onPress={onPressItem}>
              <Icon
                name="plus"
                size={15}
                color="black"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  marginTop: 50,
                  right: 0,
                  borderWidth: 1,
                  borderRadius: 25,
                  borderColor: "white",
                  backgroundColor: "white",
                  alignSelf: "center",
                  elevation: 5,
                  padding: 4,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text>{props.name}</Text>

          {props.offerPer ? (
            <View style={{flexDirection:"row"}}>
              <Text  style={{textDecorationLine:"line-through"}}> Rs.{props.price}</Text>
              <Text style={{ color: "green",marginLeft:"auto"}}>
              Rs.{props.price - (props.price * props.offerPer) / 100}
          </Text></View>
          ) : (
            <Text style={{ color: "green" }}>Rs. {props.price}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const Alert = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}>
        <View style={{
          width: 300,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red',  
            marginBottom: 10
          }}>Warning</Text>
          <Text style={{
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20
          }}>You have an allergy to garlic. Are you sure you want to add this item?</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <TouchableOpacity style={{ flex: 1, marginHorizontal: 5 }} onPress={onCancel}>
              <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, marginHorizontal: 5 }} onPress={onConfirm}>
              <Text style={{ fontSize: 16, color: 'blue', textAlign: 'center' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Global;
