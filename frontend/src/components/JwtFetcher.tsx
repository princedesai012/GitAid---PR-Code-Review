'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function JwtFetcher() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getJwt = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const res = await fetch("http://localhost:8000/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              github_user_id: session.user.id,
            }),
          });

          const data = await res.json();
          setToken(data.token);
          localStorage.setItem("jwtTo`ken", data.token); // optional
        } catch (error) {
          console.error("Failed to get JWT:", error);
        }
      }
    };

    getJwt();
  }, [session, status]);

  if (!token) return null;

  return (
    <p className="text-green-700 break-all p-4 text-sm">
      ✅ FastAPI JWT: <br />
      <code>{token}</code>
    </p>
  );
}
