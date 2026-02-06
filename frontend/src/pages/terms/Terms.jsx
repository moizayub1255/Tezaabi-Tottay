import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
        <p className="mb-4">
          These Terms govern your use of Tezaabi Tottay. By accessing or using
          our service, you agree to these terms. This is a demo site — treat any
          payment fields as non-functional dummy inputs.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">User Conduct</h2>
          <p>
            Please use the service responsibly. Do not attempt to tamper with
            application data.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Terms;
