import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github, LogOut } from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // Redirect to home if not authenticated
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center text-center mb-8">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, <span className="text-blue-600">{session.user?.name}</span>!
            </h1>
            <p className="text-gray-500 mt-1">{session.user?.email}</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-center text-blue-800">
            You're now securely logged in to your dashboard 🎉
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/Repos">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-600 transition-all duration-200">
              <Github className="w-5 h-5" />
              View My GitHub Repositories
            </button>
          </Link>

          <form action="/api/auth/signout" method="POST" className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-2 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Secure dashboard • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}