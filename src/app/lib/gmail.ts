// src/lib/gmail.ts
import { google } from "googleapis";
import { EmailFilter, EmailMessage } from "../types";

export async function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.gmail({ version: "v1", auth });
}

export async function fetchEmails(
  accessToken: string,
  filter: EmailFilter = {},
  maxResults = 50
): Promise<EmailMessage[]> {
  const gmail = await getGmailClient(accessToken);

  // Construction de la requête de recherche Gmail
  let query = "";

  if (filter.from) query += `from:${filter.from} `;
  if (filter.to) query += `to:${filter.to} `;
  if (filter.subject) query += `subject:${filter.subject} `;
  if (filter.after) query += `after:${filter.after.getTime() / 1000} `;
  if (filter.before) query += `before:${filter.before.getTime() / 1000} `;
  if (filter.hasAttachment) query += "has:attachment ";
  if (filter.labelIds && filter.labelIds.length > 0) {
    filter.labelIds.forEach((label) => {
      query += `label:${label} `;
    });
  }

  // Récupérer les messages correspondants aux critères
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: query.trim(),
  });

  const messages = response.data.messages || [];

  // Récupérer les détails de chaque message
  const emailPromises = messages.map(async (message) => {
    const messageData = await gmail.users.messages.get({
      userId: "me",
      id: message.id!,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "To", "Date"],
    });

    const headers = messageData.data.payload?.headers || [];

    const emailMessage: EmailMessage = {
      id: message.id!,
      threadId: message.threadId!,
      labelIds: messageData.data.labelIds || [],
      snippet: messageData.data.snippet || "",
      subject: headers.find((h) => h.name === "Subject")?.value,
      from: headers.find((h) => h.name === "From")?.value,
      to: headers.find((h) => h.name === "To")?.value,
      date: headers.find((h) => h.name === "Date")?.value
        ? new Date(headers.find((h) => h.name === "Date")!.value!)
        : undefined,
    };

    return emailMessage;
  });

  return Promise.all(emailPromises);
}

export async function fetchLabels(accessToken: string) {
  const gmail = await getGmailClient(accessToken);

  const response = await gmail.users.labels.list({
    userId: "me",
  });

  return response.data.labels || [];
}
