import Realm from "realm";
import { useNetInfo } from "@react-native-community/netinfo";

export const syncContactsWithServer = async (setIsSyncing, setSyncMessage, showSnackbar) => {
  const realm = await Realm.open({ schema: [/* Your schemas here if needed */] });
  const unsynced = realm.objects("Contact").filtered("syncStatus != 0");

  if (unsynced.length === 0) return;

  if (setIsSyncing) setIsSyncing(true);
  if (setSyncMessage) setSyncMessage("🔄 Syncing started...");
  if (showSnackbar) showSnackbar("🔄 Syncing started...");
  console.log("Sync started!");

  await delay(1000); // Let UI update

  for (const contact of unsynced) {
    try {
      const payload = {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        syncStatus: contact.syncStatus,
      };

      if (setSyncMessage) setSyncMessage(`🔄 Syncing ${contact.name}...`);
      if (showSnackbar) showSnackbar(`🔄 Syncing ${contact.name}...`);
      await delay(700);

      let response;
      if (contact.syncStatus === 1) {
        response = await fetch(`https://your.api/contacts/${contact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (contact.syncStatus === -1) {
        response = await fetch(`https://your.api/contacts/${contact.id}`, {
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

        const successMessage = `✅ Synced ${contact.name}`;
        if (setSyncMessage) setSyncMessage(successMessage);
        if (showSnackbar) showSnackbar(successMessage);
      } else {
        const failMessage = `❌ Failed syncing ${contact.name}`;
        if (setSyncMessage) setSyncMessage(failMessage);
        if (showSnackbar) showSnackbar(failMessage);
      }
    } catch (error) {
      console.error(`❌ Error syncing ${contact.name}:`, error);
      const errorMessage = `❌ Error syncing ${contact.name}`;
      if (setSyncMessage) setSyncMessage(errorMessage);
      if (showSnackbar) showSnackbar(errorMessage);
    }

    await delay(1000);
  }

  if (setSyncMessage) setSyncMessage("✅ All contacts synced!");
  if (showSnackbar) showSnackbar("✅ All contacts synced!");
  await delay(4000);

  if (setIsSyncing) setIsSyncing(false);
  if (setSyncMessage) setSyncMessage("");

  realm.close();
};

// Helper delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
