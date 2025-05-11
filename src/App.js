import React from "react";

import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//Importing screens from the /src directory
import ContactListScreen from "./screens/ContactListScreen";
import ContactFormScreen from "./screens/ContactFormScreen";
import ContactViewScreen from "./screens/ContactViewScreen";
//Importing the Contacts Context
import { ContactsProvider } from "./context/ContactsContext";
//Importing NetInfo
import { useNetInfo } from "@react-native-community/netinfo";

const Stack = createStackNavigator();

const netInfo = useNetInfo();

//We'll be using option 1
useEffect(() => {
    if(netInfo.isConnected){
        triggerSync();
    }
},[netInfo.isConnected]);

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        black: "#000000", // Added the missing "black" property
        primary: "#6200ee",
        secondary: "#03dac4",
    },
};

export default function App() {
    return (
        <PaperProvider theme={MD3LightTheme}>
            <ContactsProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="ContactsList">
                        <Stack.Screen
                            name="ContactsList"
                            component={ContactListScreen}
                            options={{ title: 'Contacts' }}
                        />
                        <Stack.Screen
                            name="ContactView"
                            component={ContactViewScreen}
                            options={{ title: 'View Contact' }}
                        />
                        <Stack.Screen
                            name="ContactForm"
                            component={ContactFormScreen}
                            options={{ title: 'Add/Edit Contact' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ContactsProvider>
        </PaperProvider>
    );
}
