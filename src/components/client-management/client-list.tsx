"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  state: string;
  zip_code: string;
  health_conditions: string[];
  medications: string[];
  created_at: string;
}

interface ClientListProps {
  onSelectClient: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
}

export function ClientList({
  onSelectClient,
  onDeleteClient,
}: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setIsDeleting(clientId);
      try {
        // First delete any dependents associated with this client
        const { error: dependentsError } = await supabase
          .from("dependents")
          .delete()
          .eq("client_id", clientId);

        if (dependentsError) {
          console.error("Error deleting dependents:", dependentsError);
        }

        // Then delete the client from the database
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", clientId);

        if (error) throw error;

        // Update the local state
        setClients(clients.filter((client) => client.id !== clientId));

        // Call the parent component's onDeleteClient if provided
        if (onDeleteClient) {
          onDeleteClient(clientId);
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const calculateAge = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading clients...
          </p>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Health Conditions</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.full_name}
                  </TableCell>
                  <TableCell>{calculateAge(client.date_of_birth)}</TableCell>
                  <TableCell>
                    {client.state}, {client.zip_code}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.health_conditions &&
                      client.health_conditions.length > 0 ? (
                        client.health_conditions
                          .slice(0, 2)
                          .map((condition, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-muted/50"
                            >
                              {condition}
                            </Badge>
                          ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          None
                        </span>
                      )}
                      {client.health_conditions &&
                        client.health_conditions.length > 2 && (
                          <Badge variant="outline" className="bg-muted/50">
                            +{client.health_conditions.length - 2} more
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectClient(client.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={isDeleting === client.id}
                      >
                        {isDeleting === client.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "No clients match your search criteria. Try a different search term."
                : "You haven't added any clients yet. Add a client to get started."}
            </p>
            {!searchTerm && (
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
