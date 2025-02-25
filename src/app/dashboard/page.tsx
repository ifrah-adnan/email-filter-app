import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { google } from "googleapis";
import EmailList from "../components/EmailFilter";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const emails = response.data.messages || [];

    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Your Email Dashboard</h1>
        <EmailList
          emails={emails}
          accessToken={session.accessToken as string}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Error</h1>
        <p>
          An error occurred while fetching your emails. Please try again later.
        </p>
      </main>
    );
  }
}
