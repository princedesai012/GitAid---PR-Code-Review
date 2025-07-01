import { getServerSession } from "@/lib/auth";
import { AuthButton } from "@/components/ui/auth-button";
import { JwtFetcher } from "@/components/JwtFetcher"; // <- import your new client comp
import { RepoList } from "@/components/ui/RepoList";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <AuthButton session={session} />
      {/* 👇 Mounts only if session is active */}
      <JwtFetcher />
      {/* {session && <RepoList />} */}
    </main>
  );
}
