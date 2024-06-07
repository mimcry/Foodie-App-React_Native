import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Pressable,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Portal, Provider, PaperProvider } from "react-native-paper";
import axios from "axios";
import Global from "./Global";
import { GlobalButton } from "./Global";

const Account = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://192.168.1.66:9002/addresses");
        const data = await response.json();
        const defaultAddress = data.find((address) => address.isDefault);
        if (defaultAddress) {
          data.forEach((address) => {
            if (address !== defaultAddress && address.isDefault) {
              address.isDefault = false;
            }
          });
        }
        setSavedAddresses(data);
        setDefaultAddress(defaultAddress);
        console.log("saved", savedAddresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        Alert.alert(
          "Error",
          "Failed to fetch addresses. Please try again later."
        );
      }
    };

    fetchAddresses();
  }, []);

  const navigatetohome = () => {
    navigation.navigate("Home");
  };

  const logoutAlert = () => {
    Alert.alert("Are you sure!", "Do you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => navigatetohome() },
    ]);
  };

  return (
    <PaperProvider>
      <Portal>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: 20,
            marginTop: 25,
          }}
        >
          <View style={{ flexDirection: "row", paddingBottom: 0 }}>
            <TouchableOpacity activeOpacity={0.5} onPress={navigatetohome}>
              <Icon name="arrow-left" size={25} color={"#df2020"} />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                lineHeight: 25,
                fontSize: 26,
                fontWeight: "bold",
                color: "#df2020",
              }}
            >
              Checkout
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Image
              source={{
                uri:
                  "https://c1.wallpaperflare.com/preview/856/514/335/man-face-human-portrait.jpg",
              }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Salon Gautam
          </Text>
          <Text
            style={{
              alignSelf: "center",
              color: "gray",
            }}
          >
            salongautam4@gmail.com
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={{
                color: Global.color.global,
                alignSelf: "center",
                textDecorationLine: "underline",
                marginTop: "2%",
                fontWeight: "bold",
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: "#F3F3F3",
              padding: 30,
              marginTop: "15%",
              borderRadius: 20,
              paddingTop:20
            }}
          >
          <View style={{flexDirection:"row"}}> 

          <Text
              style={{
                fontSize: Global.fontSize.medium,
             
              }}
            >
              Saved Address
            </Text>
           <TouchableOpacity activeOpacity={0.5} onPress={()=>navigation.navigate("billing address")} style={{alignSelf:"center",
             marginLeft:"auto"}}>
           <Text
              style={{
                fontSize: Global.fontSize.small,
             color:Global.color.global,
             
              }}
            >
              Add 
            </Text>
           </TouchableOpacity>
          </View>
            {savedAddresses.length > 0 ? (
              savedAddresses.map((address, index) => (
                <View
                  style={{
                    backgroundColor: "#D9D9D9",
                    padding: 20,
                    marginTop: "5%",
                    borderRadius: 15,
                    
                  }}
                  key={index}
                >
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
                        <Text
                          style={{
                            alignSelf: "center",
                            marginLeft: 10,
                          }}
                        >
                          {address.region}, {address.area},{" "}
                          {address.landmark}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", width: "100%" }}>
                        <Icon
                          name="phone"
                          color={Global.color.global}
                          size={25}
                          style={{ marginTop: 5 }}
                        />
                        <Text
                          style={{
                            alignSelf: "center",
                            marginLeft: 10,
                          }}
                        >
                          {address.mobileNumber}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {address.isDefault ? (
                    <View
                      style={{
                        backgroundColor: Global.color.global,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        alignSelf: "center",
                        marginLeft: "auto",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Default
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No saved addresses found. You can add an address.
              </Text>
            )}
          </View>
          <GlobalButton name="Sign Out" onPress={logoutAlert} />
          </ScrollView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                width: 300,
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",              }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setModalVisible(false)}
                    style={{ marginLeft: "auto" }}
                  >
                    <Icon
                      name="x-circle"
                      size={18}
                      style={{ color: Global.color.global }}
                    />
                  </TouchableOpacity>
    
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: Global.fontSize.medium,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Edit Your Profile
                  </Text>
                  <TextInput
                    placeholder="Name"
                    style={{
                      height: 40,
                      width: "100%",
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                  />
                  <TextInput
                    placeholder="Email"
                    style={{
                      height: 40,
                      width: "100%",
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                  />
                  <TextInput
                    placeholder="Number"
                    keyboardType="numeric"
                    style={{
                      height: 40,
                      width: "100%",
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                  />
                  <Pressable
                    style={{
                      marginTop: 20,
                      backgroundColor: Global.color.global,
                      padding: 10,
                      borderRadius: 5,
                      width: "100%",
                      alignItems: "center",
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </Portal>
        </PaperProvider>
      );
    };
    
    export default Account;
    
             
