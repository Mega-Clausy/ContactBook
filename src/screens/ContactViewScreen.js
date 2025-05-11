import { View } from "react-native";
import ContactCard from "../components/ContactCard";
import { useEffect, useState, useContext } from "react";
import { ContactsContext } from "../context/ContactsContext";
import { useNavigation } from "@react-navigation/native";

const ContactViewScreen = ({ route }) => {
  const contactId = route.params?.contact?.id;
  const { contacts } = useContext(ContactsContext);
  const navigation = useNavigation();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const latest = contacts.find((c) => c.id === contactId);

    if (latest) {
      const detached = {
        id: latest.id,
        name: latest.name,
        phone: latest.phone,
        email: latest.email,
      };
      setContact(detached);
    } else {
      setContact(null);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("ContactsList"); // <-- change this if needed
      }
    }
  }, [contacts, contactId]);

  // Prevent rendering until contact is fully set or validated
  if (!contact) return null;

  return (
    <View style={{ flex: 1 }}>
      <ContactCard contact={contact} />
    </View>
  );
};

export default ContactViewScreen;