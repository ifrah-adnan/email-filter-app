/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";

interface Email {
  id: string;
  snippet: string;
}

export default async function EmailList({
  emails,
  accessToken,
}: {
  emails: { id: string }[];
  accessToken: string;
}) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth });

  try {
    const emailDetails = await Promise.all(
      emails.map(async (email) => {
        const response = await gmail.users.messages.get({
          userId: "me",
          id: email.id,
        });
        return {
          id: email.id,
          snippet: response.data.snippet,
        };
      })
    );

    return (
      <ul className="space-y-4">
        {emailDetails.map((email: any) => (
          <li key={email.id} className="border p-4 rounded-lg">
            <p>{email.snippet}</p>
          </li>
        ))}
      </ul>
    );
  } catch (error) {
    console.error("Error fetching email details:", error);
    return (
      <p>
        An error occurred while fetching email details. Please try again later.
      </p>
    );
  }
}
