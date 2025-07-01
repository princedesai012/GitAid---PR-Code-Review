"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Github,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  GitPullRequest,
  Star,
  GitFork,
  Calendar,
  Code,
  Eye,
  AlertCircle,
} from "lucide-react";

type Repo = any;
type PR = { number: number; title: string; created_at?: string; state?: string };

export default function Repos() {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [prs, setPrs] = useState<PR[]>([]);
  const [selectedPr, setSelectedPr] = useState<PR | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: string }>({});
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);
  const [loadingPr, setLoadingPr] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch all repos
  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repos");
        return res.json();
      })
      .then(setRepos)
      .catch((err) => setMessage(err.message));
  }, [session]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (languageFilter === "All" || repo.language === languageFilter)
  );
  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  );

  // Load PRs for a repo
  const loadPrs = async (repo: Repo) => {
    setSelectedRepo(repo);
    setLoadingRepoId(repo.id);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/pulls`,
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch PRs");
      const data = await res.json();
      setPrs(data);
      setSelectedPr(null);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoadingRepoId(null);
    }
  };

  // Request AI review on selected PR
  const runPRReview = async () => {
    if (!selectedRepo || !selectedPr) return;
    const key = `${selectedRepo.name}#${selectedPr.number}`;
    setLoadingPr(true);
    try {
      const res = await fetch("http://localhost:8000/api/pr-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: selectedRepo.owner.login,
          repo: selectedRepo.name,
          pr_number: selectedPr.number,
        }),
      });
      const data = await res.json();
      setReviews((prev) => ({ ...prev, [key]: data.review || `❌ ${data.error}` }));
    } catch {
      setReviews((prev) => ({ ...prev, [key]: "❌ Error during review" }));
    } finally {
      setLoadingPr(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your repositories...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <Github className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome to PR Review</h2>
          <p className="text-slate-600 mb-6">Please sign in with GitHub to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Github className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                PR Review Dashboard
              </h1>
              <p className="text-slate-600 text-lg mt-1">AI-powered code review for your GitHub repositories</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-10">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400 text-slate-700 shadow-sm"
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Language Filter */}
            <div className="relative min-w-[220px]">
              <select
                className="w-full appearance-none px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white pr-12 text-slate-700 shadow-sm"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="All">🌐 All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>📝 {lang}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-6 flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Showing {filteredRepos.length} of {repos.length} repositories</span>
          </div>
        </div>

        {/* Repo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {filteredRepos.map((repo) => (
            <div key={repo.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                      <h3 className="font-bold text-slate-800 truncate text-lg group-hover:text-blue-600 transition-colors">{repo.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                      <Github className="h-3 w-3" />
                      {repo.owner.login}
                    </p>
                  </div>
                  {repo.private && (
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                      🔒 Private
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-6 line-clamp-3 min-h-[4rem] leading-relaxed">
                  {repo.description || "No description available"}
                </p>
                
                {/* Repo Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 bg-slate-50 rounded-lg p-3">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={loadingRepoId === repo.id}
                  onClick={() => loadPrs(repo)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  {loadingRepoId === repo.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading PRs...
                    </>
                  ) : (
                    <>
                      <GitPullRequest className="h-4 w-4" />
                      View Pull Requests
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No repos found */}
        {filteredRepos.length === 0 && repos.length > 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No repositories found</h3>
            <p className="text-slate-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* PR Selection Panel */}
        {prs.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <GitPullRequest className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Pull Requests for {selectedRepo?.name}
                </h3>
                <p className="text-slate-600 flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {prs.length} open pull requests available
                </p>
              </div>
            </div>
            
            {/* PR Selector */}
            <div className="relative mb-8">
              <select
                className="w-full appearance-none px-6 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white pr-12 text-slate-700 shadow-sm text-lg"
                value={selectedPr?.number ?? ""}
                onChange={(e) =>
                  setSelectedPr(prs.find((pr) => pr.number === +e.target.value) || null)
                }
              >
                <option value="" disabled>🎯 Select a pull request to review</option>
                {prs.map((pr) => (
                  <option key={pr.number} value={pr.number}>
                    #{pr.number}: {pr.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Review Button */}
            {selectedPr && (
              <div className="mb-8">
                <button
                  onClick={runPRReview}
                  disabled={loadingPr}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-purple-400 disabled:via-blue-400 disabled:to-indigo-400 text-white px-8 py-4 rounded-xl transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg font-semibold"
                >
                  {loadingPr ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      ✨ Analyzing PR...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      🚀 Review PR #{selectedPr.number}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Review Results */}
            {selectedPr && reviews[`${selectedRepo?.name}#${selectedPr.number}`] && (
              <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b-2 border-slate-200">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-slate-600" />
                    <h4 className="font-bold text-slate-800 text-lg">🤖 AI Review Results</h4>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-green-400 p-6 rounded-2xl font-mono text-sm overflow-auto max-h-96 shadow-inner border border-slate-700">
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {reviews[`${selectedRepo?.name}#${selectedPr.number}`]}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No PRs found */}
        {selectedRepo && prs.length === 0 && !loadingRepoId && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <GitPullRequest className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No open pull requests</h3>
            <p className="text-slate-600">This repository doesn't have any open pull requests to review.</p>
          </div>
        )}

        {/* Error Message */}
        {message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-red-700 text-sm">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}