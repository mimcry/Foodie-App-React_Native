import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView, View } from "react-native";
import FoodScreenFiltered from "./Components/Hompage/FoodScreenFiltered";
import Homepage from "./Components/Hompage/Homepage";
import Buttonnavbar from "./Components/Buttonnavbar";
import Cart from "./Components/Cart";
import Account from "./Components/Account";
import Checkout from "./Components/Checkout";
import Address from "./Components/Address";
import { CartProvider } from "react-use-cart";
import FoodDescription from "./Components/Hompage/FoodDescription";
import PastOrderItem from "./Components/PastOrderItem"
import Myaddress from "./Components/Myaddress";

const Stack = createStackNavigator();

const App = ({ navigation }) => {
  return (
    <CartProvider>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="foodscreen"
              component={FoodScreenFiltered}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="mycart"
              component={Cart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="checkout"
              component={Checkout}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="billing address"
              component={Address}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="My Profile"
              component={Account}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="fooddescription"
              component={FoodDescription}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="pastorderitem"
              component={PastOrderItem}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="myaddress"
              component={Myaddress}
              options={{ headerShown: false }}
            />
            
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </CartProvider>
  );
};

const HomeScreen = ({ navigation, posts }) => (
  <>
   <View style={{flex:1 }}>
  <ScrollView style={{ padding: 20, backgroundColor: "white", marginTop: 25 ,paddingTop:0}}>
    <Homepage />
  </ScrollView>
  <Buttonnavbar navigation={navigation} />
</View>

  </>
);

export default App;
