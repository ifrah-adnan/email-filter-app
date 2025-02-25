import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EmailList from "../components/EmailFilter";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Votre boîte de réception</h1>
      <EmailList />
    </main>
  );
}
