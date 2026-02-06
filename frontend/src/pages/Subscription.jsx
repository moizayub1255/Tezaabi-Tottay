import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "/month",
      features: [
        "✓ Good video quality",
        "✓ Watch on 1 screen at a time",
        "✓ Download on 1 device",
        "✓ HD available",
      ],
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: "$15.49",
      period: "/month",
      features: [
        "✓ Great video quality",
        "✓ Watch on 2 screens at a time",
        "✓ Download on 2 devices",
        "✓ Full HD available",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "/month",
      features: [
        "✓ Best video quality",
        "✓ Watch on 4 screens at a time",
        "✓ Download on 4 devices",
        "✓ Ultra HD & 4K available",
      ],
      popular: false,
    },
  ];

  const paymentMethods = [
    { id: "credit-card", name: "Credit or Debit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🔗" },
    { id: "google-pay", name: "Google Pay", icon: "📱" },
  ];

  const createLocalAccount = useAuthStore((s) => s.createLocalAccount);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Get pending signup data from localStorage (saved on SignUp page)
    const raw = localStorage.getItem("tt_pending_signup");
    const pending = raw ? JSON.parse(raw) : null;
    const plan = plans.find((p) => p.id === selectedPlan);

    // create a dummy local account and persist
    const userData = {
      email: pending?.email || "",
      username: pending?.username || pending?.email?.split("@")[0] || "User",
      plan: { id: plan.id, name: plan.name, price: plan.price },
      image: "/avatar.png",
    };

    createLocalAccount(userData).then(() => {
      // cleanup pending data
      localStorage.removeItem("tt_pending_signup");
      // save subscription info separately if needed
      localStorage.setItem("tt_subscription", JSON.stringify(userData.plan));
      navigate("/");
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
          {/* Site Header */}
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Heading Section */}
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Choose the plan that's right for you
            </h1>
            <p className="text-gray-400 text-lg">
              Watch all you want. Cancel anytime.
            </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-lg p-6 ${
                  selectedPlan === plan.id ? "border-2 border-red-600" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-gray-300">
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded font-semibold transition duration-300 ${
                    selectedPlan === plan.id
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? "SELECTED" : "SELECT PLAN"}
                </button>
              </div>
            ))}
          </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Choose your payment method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-300 ${
                    paymentMethod === method.id
                      ? "bg-gray-800 border-2 border-red-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </div>
              ))}
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "credit-card" && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Selected Plan</span>
                <span className="text-xl font-semibold">
                  {plans.find((p) => p.id === selectedPlan)?.name} Plan
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Price</span>
                <span className="text-xl font-bold">
                  {plans.find((p) => p.id === selectedPlan)?.price}
                  <span className="text-gray-400 text-sm ml-1">/month</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-lg">
                  {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-12 rounded transition duration-300 transform hover:scale-105"
            >
              START MEMBERSHIP
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              By clicking "Start Membership", you agree to our Terms of Use and
              Privacy Policy.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is Tezaabi Tottay?",
                  a: "Tezaabi Tottay is a streaming platform demo that showcases movies, shows and subscription flows in a clean UI.",
                },
                {
                  q: "How much does Tezaabi Tottay cost?",
                  a: "Subscription pricing is shown on this page. For the demo, prices are illustrative and payments are simulated locally.",
                },
                {
                  q: "How do I cancel?",
                  a: "You can cancel from your account settings. In this demo, canceling removes the local subscription data stored in your browser.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <Footer/> */}
      </div>
    </div>
  );
};

export default Subscription;
