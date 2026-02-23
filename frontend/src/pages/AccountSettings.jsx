import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Lock,
  Bell,
  CreditCard,
  Mail,
  Trash2,
  Loader,
} from "lucide-react";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("security");
  const [isLoading, setIsLoading] = useState(false);

  const [subscription, setSubscription] = useState("basic");
  // Fetch current subscription plan from backend
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/v1/settings/subscription",
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if (data.success && data.subscriptionPlan) {
          setSubscription(data.subscriptionPlan);
        }
      } catch (err) {
        // Handle error
      }
    };
    fetchSubscription();
  }, []);
  const [pendingSubscription, setPendingSubscription] = useState(null);

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: "",
  });

  const [notifications, setNotifications] = useState({
    promotions: false,
  });

  // ---------------- Handlers ----------------
  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/profile/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: emailForm.newEmail }),
        },
      );
      const data = await response.json();
      if (data.success) {
        // Optionally show success toast or update UI
        setEmailForm({ newEmail: "", password: "" });
        // Optionally refresh user info in store
      } else {
        // Optionally show error toast
      }
    } catch (err) {
      // Optionally show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    console.log("Delete account");
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleUpdateNotifications = () => {
    console.log("Update notifications:", notifications);
  };

  const handleChangeSubscription = (plan) => {
    setPendingSubscription(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!pendingSubscription || pendingSubscription === subscription) return;
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "http://localhost:5001/api/v1/settings/subscription",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan: pendingSubscription }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setSubscription(pendingSubscription);
        setPendingSubscription(null);
      }
    } catch (err) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <ArrowLeft className="size-6 text-gray-400 hover:text-white" />
          </Link>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: "security", label: "Security", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "subscription", label: "Subscription", icon: CreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 ${
                activeTab === id
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>

        {/* ---------------- SECURITY ---------------- */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Change Email */}
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Change Email</h2>
              </div>

              <form onSubmit={handleChangeEmail} className="space-y-4">
                <input
                  type="email"
                  name="newEmail"
                  value={emailForm.newEmail}
                  onChange={handleEmailChange}
                  placeholder="newemail@example.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />

                <input
                  type="password"
                  name="password"
                  value={emailForm.password}
                  onChange={handleEmailChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />

                <button className="bg-red-600 px-6 py-2 rounded-lg w-full">
                  Update Email
                </button>
              </form>
            </div>

            {/* Delete Account */}
            <div className="bg-red-900/20 rounded-lg p-8 border border-red-800">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Danger Zone</h2>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 px-6 py-2 rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* ---------------- NOTIFICATIONS ---------------- */}
        {activeTab === "notifications" && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 space-y-6">
            <h2 className="text-xl font-semibold">Notification Settings</h2>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="promotions"
                checked={notifications.promotions}
                onChange={handleNotificationChange}
              />
              Promotions
            </label>

            <button
              onClick={handleUpdateNotifications}
              className="bg-red-600 px-6 py-2 rounded-lg w-full"
            >
              Save Preferences
            </button>
          </div>
        )}

        {/* ---------------- SUBSCRIPTION ---------------- */}
        {activeTab === "subscription" && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">
              Current Plan: {subscription}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {["basic", "standard", "premium"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handleChangeSubscription(plan)}
                  className={`p-6 rounded-lg border ${
                    (pendingSubscription || subscription) === plan
                      ? "border-red-600"
                      : "border-gray-700"
                  }`}
                >
                  {plan.toUpperCase()}
                  {pendingSubscription === plan && " (Selected)"}
                </button>
              ))}
            </div>
            {pendingSubscription && pendingSubscription !== subscription && (
              <button
                onClick={handleConfirmSubscription}
                className="bg-red-600 px-6 py-2 rounded-lg w-full mb-2"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Confirm Update"}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12">
          <Link
            to="/manage-profile"
            className="px-6 py-3 bg-gray-800 rounded-lg"
          >
            Manage Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
