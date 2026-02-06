import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-black text-white">
    <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-4xl font-bold mb-6">Help Center</h1>
        <p className="mb-4">
          Need assistance? Browse articles, troubleshooting steps, and contact
          options below.
        </p>

        <div className="space-y-6">
          <article>
            <h2 className="text-xl font-semibold">Playback issues</h2>
            <p>
              Check your internet connection, try refreshing the page, or clear
              the application cache.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold">Account access</h2>
            <p>
              If you can't sign in, verify your email and password. For
              local/demo accounts, data is stored in your browser's
              localStorage.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;
