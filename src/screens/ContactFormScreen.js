import { View } from "react-native";
import ContactForm from "../components/ContactForm";
import { ContactsContext } from "../context/ContactsContext";
import { useContext } from "react";




const ContactFormScreen = ({ navigation, route }) => {
  const { addContact, updateContact } = useContext(ContactsContext);
  const contact = route.params?.contact || {};

  const onSubmit = (newContact) => {
    if (contact.id) {
      // If a contact exists, update it.
      updateContact(contact.id, newContact);
      navigation.replace("ContactView", { contactId: contact.id })
    } else {
      //Otherwise, add a new contact
      addContact(newContact);
      
    }
    navigation.goBack();  // Navigate back after saving
  };

  return (
    <View style={{ flex: 1 }}>
      <ContactForm contact={contact} onSubmit={onSubmit} />
    </View>
  );
};

export default ContactFormScreen;
