"use client";

import { signIn, signOut } from "next-auth/react";
import { Github, LogOut, Sparkles, Code, GitBranch, ShieldCheck, Zap, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import Head from "next/head";

export function AuthButton({ session }: { session: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>GitHub AI Reviewer | Professional Code Analysis Platform</title>
        <meta name="description" content="Enterprise-grade AI-powered code reviews for your GitHub repositories. Instant analysis, security insights, and actionable recommendations." />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  GitHub AI Reviewer
                </span>
                <div className="text-xs text-slate-500 font-medium">Professional Edition</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">Connected</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="group flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 group-hover:text-red-600 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="group flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span className="font-semibold">Sign in with GitHub</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
                <Star className="w-4 h-4" />
                <span>Trusted by 10,000+ developers worldwide</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                AI-Powered GitHub
                <span className="block text-blue-600">Code Reviews</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Get instant, intelligent code analysis for your GitHub repositories. 
                Professional-grade insights with security checks and actionable recommendations.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                {!session && (
                  <>
                    <button
                      onClick={handleSignIn}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Github className="w-5 h-5" />
                      <span>{isLoading ? "Connecting..." : "Start Free Analysis"}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-slate-500 text-sm">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>No credit card required • 5 free reviews</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">50K+</div>
                  <div className="text-slate-600">Repositories Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">99.9%</div>
                  <div className="text-slate-600">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">&lt;30s</div>
                  <div className="text-slate-600">Average Analysis Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Advanced Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Everything you need for
                <span className="block text-blue-600">professional code review</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Our AI analyzes your code with the same rigor as senior developers, 
                providing comprehensive insights in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast Analysis</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get comprehensive AI analysis of your entire repository in under 30 seconds. 
                  No more waiting hours for traditional code reviews.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Deep Code Insights</h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced pattern recognition identifies code smells, architectural issues, 
                  and optimization opportunities across your entire codebase.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Security & Compliance</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automated security vulnerability detection and compliance checking 
                  against industry standards and best practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-full text-slate-700 text-sm font-medium mb-4 shadow-sm">
                <span>How It Works</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Get professional reviews in
                <span className="block text-blue-600">three simple steps</span>
              </h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Connection Line */}
              <div className="absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-blue-200 transform -translate-x-0.5 hidden lg:block"></div>
              
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="relative flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-lg lg:mt-2">
                    1
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Connect Your GitHub</h3>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        Securely authenticate with your GitHub account using OAuth. 
                        We only request the minimum permissions needed for analysis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col lg:flex-row-reverse items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-reverse lg:space-x-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-lg lg:mt-2">
                    2
                  </div>
                  <div className="flex-1 text-center lg:text-right">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Select Repository</h3>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        Choose any public or private repository from your GitHub account. 
                        Our AI works with all major programming languages and frameworks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-lg lg:mt-2">
                    3
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Get Professional Insights</h3>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        Receive a comprehensive report with code quality metrics, security findings, 
                        performance recommendations, and actionable improvement suggestions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">GitHub AI Reviewer</span>
                  <div className="text-sm text-blue-600 font-medium">Professional Edition</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Enterprise-grade AI-powered code analysis for professional developers and teams. 
                Transform your development workflow with intelligent insights.
              </p>
            </div>
            
            {/* Product Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Pricing</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Security</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">API Documentation</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Contact Us</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-slate-500 text-sm">
                © {new Date().getFullYear()} GitHub AI Reviewer. All rights reserved.
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="text-sm">Designed & Built by</span>
                <span className="font-bold text-slate-900 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
                  Prince Desai
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}