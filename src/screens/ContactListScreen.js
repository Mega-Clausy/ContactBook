import { useEffect, useState, useContext } from "react";
import { FlatList, View } from "react-native";
import { FAB } from "react-native-paper";
import ContactListItem from "../components/ContactListItem";
import { ContactsContext } from '../context/ContactsContext';


const ContactListScreen = ({ navigation }) => {
    // Access contacts from global context
    const { contacts } = useContext(ContactsContext);

  useEffect(() => {
    const fetchContacts = async () => {
      const realmContacts = await getContacts();
      setContacts(realmContacts);
    };
    fetchContacts();
  }, []);

  const renderItem = ({ item }) => (
    <ContactListItem
      contact={item}
      
      onPress={() => navigation.navigate("ContactView", { contact: item })}
    />
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* FlatList to render all contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* FAB to add a new contact */}
      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => navigation.navigate("ContactForm")}
      />
    </View>
  );
};

export default ContactListScreen;
