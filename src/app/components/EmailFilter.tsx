"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface Email {
  id: string;
  snippet: string;
  from: string;
  subject: string;
  date: string;
}

export default function EmailList() {
  const [emailDetails, setEmailDetails] = useState<Email[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("/api/emails");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setEmailDetails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const filteredEmails = emailDetails.filter((email) =>
    email.from.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return <p>Chargement des e-mails...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filtrer par expéditeur"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <ul className="space-y-4">
        {filteredEmails.map((email) => (
          <li
            key={email.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{email.from}</p>
                <p className="text-sm text-gray-600">{email.subject}</p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(email.date).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-700">{email.snippet}</p>
          </li>
        ))}
      </ul>
      {filteredEmails.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Aucun e-mail trouvé pour ce filtre.
        </p>
      )}
    </div>
  );
}
