import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CorporateInfo = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-4xl font-bold mb-6">Corporate Information</h1>
        <p className="mb-4">
          Tezaabi Tottay is a demo project created for learning and showcasing a
          streaming UI.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>
            For inquiries about this demo, reach out to the project owner or
            check the repository README.
          </p>
        </section>
      </main>
    </div>
  );
};

export default CorporateInfo;
