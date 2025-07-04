import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-500">LinkedIn</span>
        </div>

        <nav className="space-x-4 hidden md:flex">
          <Link href="#" className="hover:text-blue-400">Discover</Link>
          <Link href="#" className="hover:text-blue-400">People</Link>
          <Link href="#" className="hover:text-blue-400">Learning</Link>
          <Link href="#" className="hover:text-blue-400">Jobs</Link>
        </nav>

        <div className="space-x-2 flex-shrink-0">
          <Link href="/login" className="px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">Sign in</Link>
          <Link href="/register" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">Join now</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="max-w-lg space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Welcome to your professional community</h1>
          <p className="text-gray-400">Join LinkedIn to stay connected, build relationships, and grow your career.</p>
          <div className="space-x-2">
            <Link href="/register" className="px-6 py-2 rounded bg-blue-500 hover:bg-blue-600">Join now</Link>
            <Link href="/login" className="px-6 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">Sign in</Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <img src="/hero-image.png" alt="LinkedIn Hero" className="w-full h-auto" />
        </div>
      </section>

      {/* Info Sections */}
      <section className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Search for a job</h3>
            <p className="text-gray-400">Find your next opportunity on LinkedIn and advance your career.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Find people you know</h3>
            <p className="text-gray-400">See who's already on LinkedIn and grow your professional network.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Learn new skills</h3>
            <p className="text-gray-400">Take courses to gain skills and knowledge for your career growth.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 px-4">
        © 2025 LinkedIn Clone. All rights reserved.
      </footer>
    </div>
  );
}
