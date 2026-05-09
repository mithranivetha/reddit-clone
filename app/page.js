import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: "#E0E1DD"}}>
      
      {/* Hero Section */}
      <div className="text-white py-24 px-4" style={{backgroundColor: "#0B3954"}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6" style={{fontFamily: "var(--font-playfair)"}}>
            Welcome to Nexus
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A modern community platform to share ideas, ask questions, and connect with people who share your interests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/communities" className="px-8 py-3 rounded-xl font-bold transition-all" style={{backgroundColor: "#087E8B", color: "white"}}>
              Browse Communities
            </Link>
            <Link href="/sign-up" className="px-8 py-3 rounded-xl font-bold transition-all border-2" style={{borderColor: "#E0E1DD", color: "#E0E1DD"}}>
              Join Nexus
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
          Why Nexus?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#0B3954"}}>
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Discuss</h3>
            <p style={{color: "#7A6263"}}>Join conversations on topics you care about with people who share your passion.</p>
          </div>

          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#087E8B"}}>
              <span className="text-2xl">🏷️</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Discover</h3>
            <p style={{color: "#7A6263"}}>Find posts by tags, search topics, and explore communities that match your interests.</p>
          </div>

          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#0B3954"}}>
              <span className="text-2xl">⬆️</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Vote</h3>
            <p style={{color: "#7A6263"}}>Upvote great content and help the best ideas rise to the top of every community.</p>
          </div>

        </div>
      </div>

    </div>
  );
}