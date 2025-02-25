import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginButton from "./components/LoginButton";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Email Dashboard</h1>
      <LoginButton />
    </main>
  );
}
