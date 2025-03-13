"use client";

import { useState } from "react";
import { ClientList } from "./client-list";
import { ClientDetail } from "./client-detail";

export function ClientManagement() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleDeleteClient = (clientId: string) => {
    // If the deleted client is currently selected, go back to the list view
    if (selectedClientId === clientId) {
      setSelectedClientId(null);
    }
  };

  return (
    <div>
      {selectedClientId ? (
        <ClientDetail
          clientId={selectedClientId}
          onBack={() => setSelectedClientId(null)}
        />
      ) : (
        <ClientList
          onSelectClient={setSelectedClientId}
          onDeleteClient={handleDeleteClient}
        />
      )}
    </div>
  );
}
