import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });
  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 50,
    });

    const emails = response.data.messages || [];

    const emailDetails = await Promise.all(
      emails.map(async (email) => {
        const details = await gmail.users.messages.get({
          userId: "me",
          id: email.id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = details.data.payload?.headers;
        const from = headers?.find((h) => h.name === "From")?.value || "";
        const subject = headers?.find((h) => h.name === "Subject")?.value || "";
        const date = headers?.find((h) => h.name === "Date")?.value || "";

        return {
          id: email.id,
          snippet: details.data.snippet || "",
          from,
          subject,
          date,
        };
      })
    );

    return NextResponse.json(emailDetails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
