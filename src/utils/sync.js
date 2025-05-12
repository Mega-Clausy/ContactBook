import Realm from "realm";

export const syncContactsWithServer = async (setIsSyncing, setSyncMessage) => {
  const realm = await Realm();
  const unsynced = realm.objects("Contact").filtered("syncStatus != 0");

  if (unsynced.length === 0) return;

  if (setIsSyncing) setIsSyncing(true);
  if (setSyncMessage) setSyncMessage(`🔄 Syncing ${unsynced.length} contacts...`);
  await delay(1000); // Give the UI time to display the initial sync message

  for (const contact of unsynced) {
    try {
      const payload = {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        syncStatus: contact.syncStatus
      };

      let response;

      if (setSyncMessage) setSyncMessage(`🔄 Syncing ${contact.name}...`);
      await delay(700); // Let the user read the name

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
        if (setSyncMessage) setSyncMessage(`✅ Synced ${contact.name}`);
      } else {
        if (setSyncMessage) setSyncMessage(`❌ Failed syncing ${contact.name}`);
      }

    } catch (error) {
      console.error(`❌ Error syncing ${contact.name}:`, error);
      if (setSyncMessage) setSyncMessage(`❌ Error syncing ${contact.name}`);
    }

    await delay(1000); // Show result for a moment before moving to the next
  }

  if (setSyncMessage) setSyncMessage("✅ All contacts synced!");
  await delay(4000); // Let final message show before hiding

  if (setIsSyncing) setIsSyncing(false);
  if (setSyncMessage) setSyncMessage("");

  realm.close();
};

// Helper delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}