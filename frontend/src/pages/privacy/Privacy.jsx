import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          We respect your privacy. This demo stores only minimal user data in
          your browser's localStorage for demo authentication and subscription
          status.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
          <p>
            Local data remains in your browser until cleared. No external
            servers are used for demo accounts.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
