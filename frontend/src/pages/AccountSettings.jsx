import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader,
  LogOut,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authUser";

const AccountSettings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("security");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    password: "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newReleases: true,
    promotions: false,
  });

  // Subscription state
  const [subscription, setSubscription] = useState("free");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [notifRes, subRes] = await Promise.all([
          axios.get("/api/v1/settings/notifications"),
          axios.get("/api/v1/settings/subscription"),
        ]);

        if (notifRes.data.success) {
          setNotifications(notifRes.data.notificationSettings);
        }
        if (subRes.data.success) {
          setSubscription(subRes.data.subscriptionPlan);
        }
      } catch (error) {
        console.log("Error fetching settings", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user]);

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (securityForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put("/api/v1/profile/change-password", {
        oldPassword: securityForm.oldPassword,
        newPassword: securityForm.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setSecurityForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put("/api/v1/settings/change-email", {
        newEmail: emailForm.newEmail,
        password: emailForm.password,
      });

      if (response.data.success) {
        toast.success("Email changed successfully");
        setEmailForm({
          newEmail: "",
          password: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "/api/v1/settings/notifications",
        notifications,
      );

      if (response.data.success) {
        toast.success("Notification settings updated");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update notification settings";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeSubscription = async (newPlan) => {
    setIsLoading(true);
    try {
      const response = await axios.put("/api/v1/settings/subscription", {
        plan: newPlan,
      });

      if (response.data.success) {
        setSubscription(newPlan);
        toast.success(`Subscription updated to ${newPlan}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update subscription";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return;

    setIsLoading(true);
    try {
      const response = await axios.delete("/api/v1/settings/delete-account", {
        data: { password },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");
        await logout();
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p>Please log in to access this page</p>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <Loader className="animate-spin text-red-600 size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <ArrowLeft className="size-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800">
          {[
            { id: "security", label: "Security", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "subscription", label: "Subscription", icon: CreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
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

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Change Password */}
            <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Change Password</h2>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={securityForm.oldPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin size-5" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>

            {/* Change Email */}
            <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Change Email</h2>
              </div>

              <form onSubmit={handleChangeEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Email
                  </label>
                  <input
                    type="email"
                    name="newEmail"
                    value={emailForm.newEmail}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="newemail@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={emailForm.password}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin size-5" />
                      Updating...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </button>
              </form>
            </div>

            {/* Delete Account */}
            <div className="bg-red-900/20 rounded-lg p-8 border border-red-800">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="size-6 text-red-600" />
                <h2 className="text-xl font-semibold">Danger Zone</h2>
              </div>

              <p className="text-gray-400 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>

              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin size-5" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-5" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="size-6 text-red-600" />
              <h2 className="text-xl font-semibold">Notification Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-sm text-gray-400">
                    Receive email notifications from TezabiTottay
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded cursor-pointer accent-red-600"
                />
              </div>

              <hr className="border-gray-700" />

              {/* New Releases */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">New Releases</h3>
                  <p className="text-sm text-gray-400">
                    Get notified about new movies and TV shows
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="newReleases"
                  checked={notifications.newReleases}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded cursor-pointer accent-red-600"
                />
              </div>

              <hr className="border-gray-700" />

              {/* Promotions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Promotions & Offers</h3>
                  <p className="text-sm text-gray-400">
                    Receive information about special offers and promotions
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="promotions"
                  checked={notifications.promotions}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded cursor-pointer accent-red-600"
                />
              </div>

              <hr className="border-gray-700" />

              <button
                onClick={handleUpdateNotifications}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2 w-full"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin size-5" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="size-6 text-red-600" />
              <h2 className="text-xl font-semibold">Subscription Plan</h2>
            </div>

            <p className="text-gray-400 mb-8">
              Your current plan:{" "}
              <span className="font-semibold text-white capitalize">
                {subscription}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: "free", name: "Free", price: "$0/mo" },
                { id: "basic", name: "Basic", price: "$9.99/mo" },
                { id: "standard", name: "Standard", price: "$15.99/mo" },
                { id: "premium", name: "Premium", price: "$19.99/mo" },
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg p-6 border-2 transition-all ${
                    subscription === plan.id
                      ? "border-red-600 bg-red-900/20"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-red-600 mb-4">
                    {plan.price}
                  </p>
                  <button
                    onClick={() => handleChangeSubscription(plan.id)}
                    disabled={isLoading || subscription === plan.id}
                    className={`w-full py-2 px-4 font-semibold rounded-lg transition ${
                      subscription === plan.id
                        ? "bg-gray-700 text-gray-400 cursor-default"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {subscription === plan.id ? "Current Plan" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 flex gap-4">
          <Link
            to="/manage-profile"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
          >
            Manage Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
