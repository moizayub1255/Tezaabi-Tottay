import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-900 via-black to-black text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-14">
          {/* BRAND */}
          <div className="md:w-1/3">
            <h3 className="text-2xl font-extrabold tracking-wide mb-4">
              <span className="text-red-500">TezabiTottay</span>
            </h3>

            <p className="text-gray-400 leading-relaxed mb-6">
              Stream demos and curated content with a cinematic experience.
              Built to explore modern UI flows and real-world product layouts.
            </p>

            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition">
                YouTube
              </button>
              <button className="px-4 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition">
                Twitter
              </button>
              <button className="px-4 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition">
                GitHub
              </button>
            </div>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:w-1/2">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/corporate" className="hover:text-white transition">
                    Corporate
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-white transition">
                    Cookie Preferences
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/terms" className="hover:text-white transition">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                </li>
                <li className="text-gray-400">
                  Questions? Call{" "}
                  <p className="text-white font-medium">
                    1-844-505-2993
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div>
            © 2026{" "}
            <span className="text-red-500 font-semibold">TezabiTottay</span>.
            All rights reserved.
          </div>
          <div>Built with ❤️ by team TezabiTottay</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
