import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Faq = () => {
  return (
    <div className="min-h-screen bg-black text-white">
     <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              What is Tezaabi Tottay?
            </h2>
            <p>
              Tezaabi Tottay is a streaming platform showcasing movies and TV
              shows. Enjoy content curated for you with flexible subscription
              plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">How do I subscribe?</h2>
            <p>
              Create an account and pick a subscription plan on the
              "Subscription" page. For this demo, payments are simulated and
              stored locally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">How do I cancel?</h2>
            <p>
              You can cancel from your account settings. Cancellation is
              immediate and simple.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Faq;
