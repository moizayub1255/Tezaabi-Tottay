import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CookiePreferences = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-4xl font-bold mb-6">Cookie Preferences</h1>
        <p className="mb-4">
          We use cookies to improve your experience. For this demo app
          cookies/localStorage are used for storing session state.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Manage Cookies</h2>
          <p>
            You can clear site data in your browser settings to remove stored
            preferences.
          </p>
        </section>
      </main>
    </div>
  );
};

export default CookiePreferences;
