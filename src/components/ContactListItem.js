import { List, Avatar } from "react-native-paper";

const ContactListItem = ({ contact, onPress }) => {
  const { name, phone } = contact;

  return (
    <List.Item
      title={name}
      description={phone}
      left={() => (
        <Avatar.Text size={40} label={name ? name[0] : "?"} />
      )}
      onPress={onPress}
    />
  );
};

export default ContactListItem;