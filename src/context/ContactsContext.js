import React, { createContext, useState, useEffect } from 'react';
import Realm from 'realm';

// Define a Contact schema for Realm
const ContactSchema = {
  name: 'Contact',
  properties: {
    id: 'string',         // Unique identifier for each contact
    name: 'string',
    phone: 'string',
    email: 'string?',   //The question mark "?" means it's optional
    syncStatus: 'int' // syncStatus: 0 = synced, 1 = new/unsynced, -1 = to delete
  },
  primaryKey: 'id',
};

// Open a Realm instance with the Contact schema
const realm = new Realm({ schema: [ContactSchema] });

// Create your Contacts Context
export const ContactsContext = createContext();

// Create a Provider component that will wrap your app
export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  // Function to load (Read) contacts from Realm into state
  const loadContacts = () => {
    // realm.objects returns a live Results collection; we convert it to an array
    const realmContacts = realm.objects('Contact');
    setContacts(realmContacts.map(contact =>({
      id: contact.id,
      name: contact.name,
      phone:contact.phone,
      email: contact.email,
      syncStatus:contact.syncStatus
    })));
  };

  // Load contacts when the provider mounts and set up a listener to update state on changes
  useEffect(() => {
    loadContacts();

    // Optionally listen for Realm changes to automatically refresh your UI
    realm.addListener('change', loadContacts);

    return () => {
      realm.removeListener('change', loadContacts);
    };
  }, []);

  // Function to create a new contact
  const addContact = (contactData) => {
    try {
      realm.write(() => {
        // Destructure contactData to extract individual values
        const {name,phone,email} = contactData;
        // Generate a unique ud as a string by using the current timestamp)
        const newId = Date.now().toString();
        realm.create('Contact', { id: newId, name, phone, email, syncStatus: 1 });

      });
      // Refresh contacts from Realm
      loadContacts();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // Function to update an existing contact
  const updateContact = (id, newData) => {
    try {
      realm.write(() => {
        let contactToUpdate = realm.objectForPrimaryKey('Contact', id);
        if (contactToUpdate) {
          contactToUpdate.name = newData.name;
          contactToUpdate.phone = newData.phone;
          contactToUpdate.email = newData.email;
          contactToUpdate.syncStatus = 1;
        }
      });
      loadContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  // Function to delete a contact
  const deleteContact = (id) => {
    try {
      realm.write(() => {
        let contactToDelete = realm.objectForPrimaryKey('Contact', id);
        if (contactToDelete) {
          contactToDelete.syncStatus = -1
          realm.delete(contactToDelete);
          
        }
      });
      loadContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const value = { contacts, setContacts, addContact, updateContact, deleteContact };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};