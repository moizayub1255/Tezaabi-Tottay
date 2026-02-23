import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/authUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

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
        const response = await api.get("/api/v1/settings/subscription");
        if (response.data.success && response.data.subscriptionPlan) {
          setSubscription(response.data.subscriptionPlan);
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    };
    fetchSubscription();
  }, []);

  const [pendingSubscription, setPendingSubscription] = useState(null);

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: "",
  });

  // ---------------- Handlers ----------------
  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put("/api/v1/settings/change-email", {
        newEmail: emailForm.newEmail,
        password: emailForm.password,
      });

      if (response.data.success) {
        toast.success("Email updated successfully!");
        setEmailForm({ newEmail: "", password: "" });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleDeleteAccount = async () => {
    const password = window.prompt(
      "Please enter your password to confirm account deletion:",
    );
    if (!password) return;

    setIsLoading(true);
    try {
      const response = await api.delete("/api/v1/auth/deleteAccount", {
        data: { password },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");
        // Clear user state manually if needed
        localStorage.removeItem("tt_user");
        // Optionally call logout, but ignore its error
        try {
          await logout();
        } catch (e) {
          // ignore logout error after deletion
        }
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error deleting account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeSubscription = (plan) => {
    setPendingSubscription(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!pendingSubscription || pendingSubscription === subscription) return;
    setIsLoading(true);
    try {
      const response = await api.put("/api/v1/settings/subscription", {
        plan: pendingSubscription,
      });

      if (response.data.success) {
        setSubscription(pendingSubscription);
        setPendingSubscription(null);
        toast.success(`Subscription updated to ${pendingSubscription}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update subscription";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  if (!user) {
    return null; // Will redirect to login
  }

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
                  placeholder="Password (required for verification)"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  required
                />

                <button
                  type="submit"
                  className="bg-red-600 px-6 py-2 rounded-lg w-full disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Email"}
                </button>
              </form>
            </div>

            {/* Delete Account */}
            <div className="bg-red-900/20 rounded-lg p-8 border border-red-800">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Danger Zone</h2>
              </div>

              <p className="text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 px-6 py-2 rounded-lg disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- SUBSCRIPTION ---------------- */}
        {activeTab === "subscription" && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">
              Current Plan:{" "}
              {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {["basic", "standard", "premium"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handleChangeSubscription(plan)}
                  className={`p-6 rounded-lg border ${
                    (pendingSubscription || subscription) === plan
                      ? "border-red-600 bg-red-600/20"
                      : "border-gray-700"
                  }`}
                >
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  {pendingSubscription === plan && " (Selected)"}
                </button>
              ))}
            </div>
            {pendingSubscription && pendingSubscription !== subscription && (
              <button
                onClick={handleConfirmSubscription}
                className="bg-red-600 px-6 py-2 rounded-lg w-full mb-2 disabled:opacity-50"
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
            className="px-6 py-3 bg-gray-800 rounded-lg inline-block"
          >
            Manage Profile
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountSettings;
