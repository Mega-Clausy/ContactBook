import Realm from "realm";

// Asegúrate de importar tu ContactSchema real si lo tienes en otro archivo
const ContactSchema = {
  name: "Contact",
  primaryKey: "_id",
  properties: {
    _id: "string",
    name: "string",
    phone: "string",
    email: "string?",
    syncStatus: "int", // 0 = synced, 1 = modified/new, -1 = to delete
  },
};

export const syncContactsWithServer = async (
  setIsSyncing,
  setSyncMessage,
  setSnackbarMessage,
  setSnackbarVisible
) => {
  const realm = await Realm.open({
    path: "contactsRealm",
    schema: [ContactSchema],
  });

  const unsynced = realm.objects("Contact").filtered("syncStatus != 0");

  if (unsynced.length === 0) {
    console.log("✅ No contacts to sync.");
    return;
  }

  if (setIsSyncing) setIsSyncing(true);
  if (setSyncMessage) setSyncMessage("🔄 Syncing ${unsynced.length} contacts...");
  await delay(1000);

  for (const contact of unsynced) {
    try {
      const payload = {
        id: contact._id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
      };

      let response;
      if (setSyncMessage) setSyncMessage("🔄 Syncing ${contact.name}...");
      await delay(700);

      if (contact.syncStatus === 1) {
        response = await fetch(`https://your.api/contacts/${contact._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (contact.syncStatus === -1) {
        response = await fetch(`https://your.api/contacts/${contact._id}`, {
          method: "DELETE",
        });
      }

      if (response.ok) {
        realm.write(() => {
          if (contact.syncStatus === -1) {
            realm.delete(contact);
          } else {
            contact.syncStatus = 0;
          }
        });
        if (setSyncMessage) setSyncMessage("✅ Synced ${contact.name}");
      } else {
        if (setSyncMessage) setSyncMessage("❌ Failed syncing ${contact.name}");
      }

    } catch (error) {
      console.error("❌ Error syncing ${contact.name}:, error");
      if (setSyncMessage) setSyncMessage("❌ Error syncing ${contact.name}");
    }

    await delay(1000);
  }

  if (setSyncMessage) setSyncMessage("✅ All contacts synced!");
  if (setSnackbarMessage && setSnackbarVisible) {
    setSnackbarMessage("✅ All contacts synced!");
    setSnackbarVisible(true);
  }

  await delay(4000);

  if (setIsSyncing) setIsSyncing(false);
  if (setSyncMessage) setSyncMessage("");

  realm.close();
};

// Simple delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}