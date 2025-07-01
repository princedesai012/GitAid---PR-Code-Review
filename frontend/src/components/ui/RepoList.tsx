"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function RepoList() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then(res => res.json())
      .then(data => setRepos(data))
      .catch(err => console.error("Failed to fetch repos:", err));
  }, [session]);

  if (!session) return <p>Loading session...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Your GitHub Repositories</h2>
      <ul>
        {repos.map((repo: any) => (
          <li key={repo.id}>
            <a href={repo.html_url} className="text-blue-500" target="_blank">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
