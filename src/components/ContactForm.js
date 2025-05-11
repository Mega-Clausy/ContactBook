import { useState } from "react";
import { TextInput, Button } from "react-native-paper";

const ContactForm = ({ contact = {}, onSubmit }) => {
  const [name, setName] = useState(contact.name || "");
  const [phone, setPhone] = useState(contact.phone || "");
  const [email, setEmail] = useState(contact.email || "");

  return (
    <>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        mode="outlined"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        mode="outlined"
        style={{ marginBottom: 16 }}
      />
      <Button
        mode="contained"
        onPress={() => onSubmit({ name, phone, email })}
      >
        Save
      </Button>
    </>
  );
};

export default ContactForm;
