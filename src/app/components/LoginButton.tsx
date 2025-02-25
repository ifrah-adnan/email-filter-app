// src/components/LoginButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuth = async () => {
    if (session) {
      await signOut({ redirect: false });
      router.push("/");
    } else {
      await signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <button
      onClick={handleAuth}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
    >
      <span className="mr-2">
        {session ? "Se déconnecter" : "Se connecter avec Google"}
      </span>
      {!session && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.198-2.701-6.735-2.701-5.551 0-10.041 4.489-10.041 10.041s4.49 10.041 10.041 10.041c5.552 0 9.369-3.898 9.369-9.369 0-0.703-0.077-1.381-0.219-2.038h-9.15z" />
        </svg>
      )}
    </button>
  );
}
