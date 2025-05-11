import Realm from "realm";

const realm = await Realm();

export const ContactSchema = {
  name: 'Contact',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    phone: 'string',
    email: 'string?',
    syncStatus: 'int',  // 0: syncronized, 1: standby, -1: marked for deletiopn
  },
}


//Create
realm.write(() => {
  realm.create('Contact', {
    id: newId,
    name,
    phone,
    email,
    syncStatus: 1, // nuevo → necesita sincronizar
  });
});

//Update
realm.write(() => {
  const contact = realm.objectForPrimaryKey('Contact', id);
  if (contact) {
    contact.name = newData.name;
    contact.phone = newData.phone;
    contact.email = newData.email;
    contact.syncStatus = 1; // modificado → necesita sincronizar
  }
});

//Delete
realm.write(() => {
  const contact = realm.objectForPrimaryKey('Contact', id);
  if (contact) {
    contact.syncStatus = -1; // marcado para eliminación
  }
});