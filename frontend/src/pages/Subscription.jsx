import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardErrors, setCardErrors] = useState({});
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$4.99",
      period: "/month",
      features: ["✓ Watch Movies", "✗ TV Shows", "✗ Premium/Exclusive Content"],
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: "$9.99",
      period: "/month",
      features: ["✓ Watch Movies", "✓ TV Shows", "✗ Premium/Exclusive Content"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$14.99",
      period: "/month",
      features: ["✓ Watch Movies", "✓ TV Shows", "✓ Premium/Exclusive Content"],
      popular: false,
    },
  ];

  const paymentMethods = [
    { id: "credit-card", name: "Credit or Debit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🔗" },
  ];

  const { signup } = useAuthStore();
  const handleSubmit = async () => {
    const errors = {};
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

    // Get signup data from localStorage
    const pendingSignup = JSON.parse(localStorage.getItem("tt_pending_signup"));
    if (!pendingSignup) {
      toast.error(
        "Signup information missing. Please start from the signup page.",
      );
      return;
    }
    const credentials = {
      username: pendingSignup.username,
      email: pendingSignup.email,
      password: pendingSignup.password,
      plan: selectedPlan,
      paymentMethod,
      cardNumber,
      expiry,
      cvv,
    };
    await signup(credentials);
    // Navigation will be handled by useEffect when user is set
  };

  // Navigate to /home when user is set after signup
  const { user } = useAuthStore();

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
              Create Account
            </button>
            {/* <p className="text-gray-400 mt-4 text-sm">
              By clicking this, you agree that this was probably a bad idea.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
