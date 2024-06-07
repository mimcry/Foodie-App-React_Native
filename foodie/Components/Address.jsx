import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,Alert } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';
import Global from './Global';
import { GlobalButton } from './Global';
import axios from 'axios';

const Address = ({ navigation }) => {
  const [region, setRegion] = useState('');
  const [area, setArea] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]); 

  const regions = [
    { label: "Kathmandu", value: "Kathmandu" },
    { label: "Bhaktpur", value: "Bhaktpur" },
    { label: "Lalitpur", value: "Lalitpur" }
  ];

  const areas = {
    Kathmandu: [
      { label: "Thamel", value: "Thamel" },
      { label: "Balaju", value: "Balaju" },
      { label: "Swayambhu", value: "Swayambhu" },
      { label: "Boudha", value: "Boudha" },
      { label: "Pashupatinath", value: "Pashupatinath" },
      { label: "New Baneshwor", value: "New Baneshwor" },
      { label: "Kalanki", value: "Kalanki" },
      { label: "Gongabu", value: "Gongabu" },
      { label: "Maharajgunj", value: "Maharajgunj" },
      { label: "Kirtipur", value: "Kirtipur" }
    ],
    Bhaktpur: [
      { label: "Sallaghari", value: "Sallghari" },
      { label: "Bhaktapur Durbar Square", value: "Bhaktapur Durbar Square" },
      { label: "Taumadhi Square", value: "Taumadhi Square" },
      { label: "Dattatreya Square", value: "Dattatreya Square" },
      { label: "Nagarkot", value: "Nagarkot" },
      { label: "Suryabinayak", value: "Suryabinayak" },
      { label: "Thimi", value: "Thimi" },
      { label: "Kamaldhunga", value: "Kamaldhunga" },
      { label: "Madhyapur", value: "Madhyapur" },
      { label: "Byasi", value: "Byasi" },
      { label: "Lokanthali", value: "Lokanthali" },
    ],
    Lalitpur: [
      { label: "Patan Durbar Square", value: "Patan Durbar Square" },
      { label: "Lagankhel", value: "Lagankhel" },
      { label: "Pulchowk", value: "Pulchowk" },
      { label: "Jawalakhel", value: "Jawalakhel" },
      { label: "Kupandol", value: "Kupandol" },
      { label: "Satdobato", value: "Satdobato" },
      { label: "Bhaisepati", value: "Bhaisepati" },
      { label: "Sanepa", value: "Sanepa" },
      { label: "Nakhipot", value: "Nakhipot" },
      { label: "Hattiban", value: "Hattiban" }
    ]
  };

  const onChangeRegion = (value) => {
    setRegion(value);
    setArea(""); 
    setLandmark("");
  };
  const onChangearea =(value)=>{
    setArea(value);
    setLandmark("");

  }

  const validateMobileNumber = (number) => {
    const regex = /^98\d{8}$/;
    if (!regex.test(number)) {
      setValidationMessage('Mobile number must start with 98 and be exactly 10 digits long.');
    } else {
      setValidationMessage('');
    }
  };

  const handleMobileNumberChange = (text) => {
    setMobileNumber(text);
    validateMobileNumber(text);
  };

  const handleSaveAddress = async () => {
    if (!region || !area || !mobileNumber || !landmark) {
      Alert.alert('Please fill in all fields.');
      return;
    }
  
    const newAddress = { region, area, mobileNumber, landmark, isDefault };
  
    try {
    
      await axios.post('http://192.168.1.66:9002/saveaddress', newAddress);
   
      navigation.navigate("myaddress")
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again later.');
    }
  };
  
  const checkout = () => {
    navigation.navigate("checkout");
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          padding: 25,
          marginTop: 20,
          paddingBottom: 0,
        }}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={()=>navigation.goBack()}>
          <Icon name="arrowleft" size={25} color={"#df2020"} />
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            flex: 1,
            lineHeight: 25,
            fontSize: Global.fontSize.large,
            fontWeight: "bold",
            color: "#df2020",
          }}
        >
          Add Billing Address
        </Text>
      </View>
      <ScrollView>
        <View style={{ padding: 25 }}>
          <View>
            <Text>Mobile number </Text>
            <TextInput
              value={mobileNumber}
              onChangeText={handleMobileNumberChange}
              keyboardType='numeric'
              style={{height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                paddingLeft: 10,
                borderRadius: 10,
                marginTop: 10,}}
            />
            {validationMessage ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{validationMessage}</Text>
            ) : null}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text >City</Text>
            <Dropdown
              style={{ height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,}}
              placeholderStyle={{color: 'gray',}}
              selectedTextStyle={{ color: 'black',}}
              data={regions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select City"
              value={region}
              onChange={item => {
                onChangeRegion(item.value);
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text >Area</Text>
            <Dropdown
              style={{ height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,}}
              placeholderStyle={{color: 'gray',}}
              selectedTextStyle={{ color: 'black',}}
              data={region ? areas[region] : []}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Area"
              value={area}
              onChange={item => {
                onChangearea(item.value);
              }}
              disabled={!region}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Landmark </Text>
            <TextInput
              value={landmark}
              onChangeText={setLandmark}
              style={{height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                paddingLeft: 10,
                borderRadius: 10,
                marginTop: 10,}}
              placeholder='Example: bus park'
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Checkbox
              status={isDefault ? 'checked' : 'unchecked'}
              onPress={() => setIsDefault(!isDefault)}
              color="#df2020"
            />
            <Text style={{ marginLeft: 10 }}>Set as default address</Text>
          </View>
          <View style={{ marginBottom: 80 ,marginTop:-20}}>
            <GlobalButton name="Save Address" onPress={handleSaveAddress} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


export default Address;

