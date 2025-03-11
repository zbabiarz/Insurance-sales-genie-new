import { ClientManagement } from "@/components/client-management/client-management";

export default function ClientManagementPreview() {
  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Client Management</h1>
        <ClientManagement />
      </div>
    </div>
  );
}
