import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              Xquisite<span className="text-blue-600">.</span>
            </h3>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-500 mb-4">
              Premium Rentals
            </p>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting people with quality, verified rental homes across the region without the hassle.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-50 mb-6">Explore</p>
            <div className="flex flex-col gap-4">
              <Link href="/listings" className="text-sm hover:text-white transition-colors">
                All Listings
              </Link>
              <Link href="/saved" className="text-sm hover:text-white transition-colors">
                Saved Properties
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-50 mb-6">Contact</p>
            <p className="text-sm mb-2">For enquiries about any listing,</p>
            <p className="text-sm">use the contact button on each property.</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Xquisite Rentals. All rights reserved.
          </p>
          <p className="text-sm">
            Built by{' '}
            <a
              href="https://rexorokumue.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-medium hover:text-blue-400 transition-colors"
            >
              Rex Orokumue
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}