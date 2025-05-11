
import { Card, Text, Avatar, IconButton, Dialog, Portal, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { ContactsContext } from "../context/ContactsContext";

const ContactCard = ({ contact }) => {
  const navigation = useNavigation();
  const { deleteContact } = useContext(ContactsContext);
  const [visible, SetVisible] = useState(false);

  const showDialog = () => SetVisible(true);
  const hideDialog = () => SetVisible(false);

  const handleDelete = () => {
    try {
      deleteContact(contact.id);
      hideDialog();
      navigation.goBack(); // Optional: Go back after deletion
    } catch (error) {
      console.error("Failed to delete contact:", error);
      hideDialog();
     
    }
  };
  const name = contact?.name ?? "Unknown";
  const phone = contact?.phone ?? "No phone";
  const email = contact?.email ?? null;
  const initials = name[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Card style={{ margin: 8 }}>
        <Card.Title
          title={name}
          subtitle={phone}
          left={(props) => <Avatar.Text {...props} label={initials} />}
        />
        <Card.Content>
          {email && <Text>Email: {email}</Text>}
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="pencil"
            size={20}
            accessibilityLabel="Edit contact"
            onPress={() => navigation.navigate("ContactForm", { contact })}
          />
          <IconButton
            icon="trash-can"
            size={20}
            accessibilityLabel="Delete contact"
            onPress={showDialog}
          />
        </Card.Actions>
      </Card>
      {/*Delete Dialog here */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete Contact</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete "{name}"?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default ContactCard;
