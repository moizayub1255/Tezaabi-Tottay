import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("chaotic");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardErrors, setCardErrors] = useState({});

  const plans = [
    {
      id: "broke",
      name: "Broke but Hopeful",
      price: "$0.99",
      period: "/month",
      features: [
        "✓ Access to absolutely nothing",
        "✓ Occasional motivational quotes",
        "✓ 1 random bug per week",
        "✓ Feeling of financial responsibility",
      ],
      popular: false,
    },
    {
      id: "chaotic",
      name: "Chaotic Neutral",
      price: "$12.34",
      period: "/month",
      features: [
        "✓ Features may or may not work",
        "✓ Surprise UI changes at midnight",
        "✓ Priority confusion support",
        "✓ Emotional rollercoaster included",
      ],
      popular: true,
    },
    {
      id: "overkill",
      name: "Overkill Deluxe",
      price: "$99.99",
      period: "/month",
      features: [
        "✓ Everything from other plans (probably)",
        "✓ Fake VIP feeling",
        "✓ Developer sends you good vibes",
        "✓ Bragging rights with zero benefits",
      ],
      popular: false,
    },
  ];

  const paymentMethods = [
    { id: "credit-card", name: "Credit or Debit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🔗" },
    { id: "google-pay", name: "Google Pay", icon: "📱" },
  ];

  const signup = useAuthStore((s) => s.signup);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = localStorage.getItem("tt_pending_signup");
    const pending = raw ? JSON.parse(raw) : null;
    const plan = plans.find((p) => p.id === selectedPlan);

    if (!pending || !pending.email || !pending.username || !pending.password) {
      // If signup data is missing, do nothing (account is likely already created)
      // Optionally, show a less intrusive message or just return silently
      return;
    }

    // Card validation if credit/debit card selected
    let errors = {};
    if (paymentMethod === "credit-card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        errors.cardNumber = "Card number must be 16 digits.";
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        errors.expiry = "Expiry must be MM/YY format.";
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        errors.cvv = "CVV must be 3 or 4 digits.";
      }
    }
    setCardErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const credentials = {
      email: pending.email,
      username: pending.username,
      password: pending.password,
      plan: plan.id,
      paymentMethod,
      cardNumber: paymentMethod === "credit-card" ? cardNumber : undefined,
      expiry: paymentMethod === "credit-card" ? expiry : undefined,
      cvv: paymentMethod === "credit-card" ? cvv : undefined,
    };

    signup(credentials).then((res) => {
      if (res && res.success !== false) {
        localStorage.removeItem("tt_pending_signup");
        localStorage.setItem("tt_subscription", JSON.stringify(plan));
        // navigation will be handled by useEffect below
      }
    });
  };

  // Navigate to /home when user is set after signup
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max- mx-auto">
        <Navbar />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Pick your level of questionable decisions
            </h1>
            <p className="text-gray-400 text-lg">
              No refunds. Mostly because there’s nothing to refund.
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
                        MOST QUESTIONABLE
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

          <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              How would you like to waste money?
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

            {paymentMethod === "credit-card" && (
              <form className="space-y-4 mb-8">
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                    placeholder="Card Number (16 digits)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={16}
                  />
                  {cardErrors.cardNumber && (
                    <div className="text-red-400 text-sm mt-1">
                      {cardErrors.cardNumber}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                    placeholder="Expiry (MM/YY)"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                  />
                  {cardErrors.expiry && (
                    <div className="text-red-400 text-sm mt-1">
                      {cardErrors.expiry}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                    placeholder="CVV (3 or 4 digits)"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                  {cardErrors.cvv && (
                    <div className="text-red-400 text-sm mt-1">
                      {cardErrors.cvv}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Chosen Chaos Level</span>
                <span className="text-xl font-semibold">
                  {plans.find((p) => p.id === selectedPlan)?.name}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Damage</span>
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

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-12 rounded transition duration-300 transform hover:scale-105"
            >
              ACCEPT MY FATE
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              By clicking this, you agree that this was probably a bad idea.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
