import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 text-gray-400 text-sm py-4 px-2 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link href="#" className="hover:text-blue-400">About</Link>
          <Link href="#" className="hover:text-blue-400">Accessibility</Link>
          <Link href="#" className="hover:text-blue-400">Help Center</Link>
          <Link href="#" className="hover:text-blue-400">Privacy & Terms</Link>
          <Link href="#" className="hover:text-blue-400">Ad Choices</Link>
          <Link href="#" className="hover:text-blue-400">Advertising</Link>
          <Link href="#" className="hover:text-blue-400">Business Services</Link>
          <Link href="#" className="hover:text-blue-400">Get the LinkedIn app</Link>
        </div>

        <div className="text-center md:text-right">
          <span className="text-blue-500 font-semibold">LinkedIn</span> © 2025
        </div>
      </div>
    </footer>
  );
}
