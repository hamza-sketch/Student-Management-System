import { Link } from "react-router-dom";
import { Package, TrendingUp, Shield, BarChart3, Users, Zap, ArrowRight, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      <div>     {/**For slight Zoom-Out */}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <header className="relative z-20 flex justify-between items-center px-8 lg:px-16 py-5 border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Student Management System
          </h1>
        </div>
        <nav className="flex gap-4 items-center">
          {token ? (
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/50"
            >
              Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/50"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between flex-1 px-8 lg:px-20 py-20  gap-12">
        <div className="max-w-2xl text-center md:text-left">
          {/* Main Heading */}
          <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Student{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse">
              Management
            </span>{" "}
            System
          </h2>

          {/* Subheading */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Keep your Data in one platform. Grow faster with insights you can trust and automation that works.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Smart Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Secure Cloud Storage</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">24/7 Support</span>
            </div>
          </div>
          
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-30"></div>
          <div className="relative w-[380px] lg:w-[500px] h-[260px] lg:h-[340px] bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20 overflow-hidden">
            <img
              src="images/landingpage-right-image.jpg"
              alt="Dashboard Preview"
              className="w-full h-full object-cover rounded-3xl"
            />
            {/* Floating Stats */}
            
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 lg:px-20 py-20 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="text-center mb-16">
          <h3 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Powerful Features,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Simple Interface
            </span>
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage your Institute
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature Card 1 */}
          <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-white">
              Students Track
            </h4>
            <p className="text-gray-400 leading-relaxed">
              
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-white">
              Smart Analytics
            </h4>
            <p className="text-gray-400 leading-relaxed">
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="group p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-white">
              Secure Access
            </h4>
            <p className="text-gray-400 leading-relaxed">
            </p>
          </div>
          
        </div>
      </section>

      </div>
    </div>
  );
}