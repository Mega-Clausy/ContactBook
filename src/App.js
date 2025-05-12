import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import {
    Provider as PaperProvider,
    MD3LightTheme,
    Snackbar,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import ContactListScreen from "./screens/ContactListScreen";
import ContactFormScreen from "./screens/ContactFormScreen";
import ContactViewScreen from "./screens/ContactViewScreen";

// Context
import { ContactsProvider } from "./context/ContactsContext";

// NetInfo
import { useNetInfo } from "@react-native-community/netinfo";

// Sync
import { syncContactsWithServer } from "./utils/sync";

const Stack = createStackNavigator();

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        black: "#000000",
        primary: "#6200ee",
        secondary: "#03dac4",
    },
};

export default function App() {
    const netInfo = useNetInfo();

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");

    // Show snackbar helper
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    // Trigger sync when connection is restored
    useEffect(() => {
        if (netInfo.isConnected) {
            console.log("Network status", netInfo.isConnected);
            syncContactsWithServer(
                setIsSyncing,
                setSyncMessage,
                setSnackbarMessage,
                setSnackbarVisible
            );
        }
    }, [netInfo.isConnected]);

    return (
        <PaperProvider theme={theme}>
            <ContactsProvider>
                <View style={{ flex: 1 }}>
                    {/* App navigation */}
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="ContactsList">
                            <Stack.Screen
                                name="ContactsList"
                                component={ContactListScreen}
                                options={{ title: "Contacts" }}
                            />
                            <Stack.Screen
                                name="ContactView"
                                component={ContactViewScreen}
                                options={{ title: "View Contact" }}
                            />
                            <Stack.Screen
                                name="ContactForm"
                                component={ContactFormScreen}
                                options={{ title: "Add/Edit Contact" }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>

                    {/* Syncing banner */}
                    {isSyncing && syncMessage !== "" && (
                        <View style={styles.syncBanner}>
                            <ActivityIndicator size="small" color="#6200ee" />
                            <Text style={styles.syncText}>{syncMessage}</Text>
                        </View>
                    )}

                    {/* Snackbar message */}
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
}

const styles = StyleSheet.create({
    syncBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        padding: 10,
    },
    syncText: {
        marginLeft: 10,
        color: "#000",
    },
});