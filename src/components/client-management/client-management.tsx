"use client";

import { useState } from "react";
import { ClientList } from "./client-list";
import { ClientDetail } from "./client-detail";

export function ClientManagement() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div>
      {selectedClientId ? (
        <ClientDetail
          clientId={selectedClientId}
          onBack={() => setSelectedClientId(null)}
        />
      ) : (
        <ClientList onSelectClient={setSelectedClientId} />
      )}
    </div>
  );
}
