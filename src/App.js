import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Provider as PaperProvider, MD3LightTheme, Snackbar } from "react-native-paper";
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
import { syncContactsWithServer } from "./utils/sync";

const Stack = createStackNavigator();


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
    //We'll be using option 1
    const netInfo = useNetInfo();
    //This setup helps me add a message regarding to the synchronization.
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState(""); 

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    useEffect(() => {
        if (netInfo.isConnected) {
            syncContactsWithServer(setIsSyncing, setSyncMessage);
        }
    }, [netInfo.isConnected]);


    return (
        <PaperProvider theme={MD3LightTheme}>
            <ContactsProvider>
                <View style={{ flex: 1 }}>
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
                    {isSyncing && syncMessage !== "" && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                            <ActivityIndicator size="small" color="#6200ee" />
                            <Text style={{ marginLeft: 8 }}>{syncMessage}</Text>
                        </View>
                    )}

                    {/* Snackbar for brief messages */}
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={4000}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </View>
            </ContactsProvider>
        </PaperProvider>
    );
};
