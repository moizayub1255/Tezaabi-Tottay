import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WatchPage from "./pages/WatchPage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useWatchlistStore } from "./store/watchlist";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/404";
import Subscription from "./pages/Subscription";
import Faq from "./pages/faq/Faq";
import HelpCenter from "./pages/help/HelpCenter";
import Terms from "./pages/terms/Terms";
import Privacy from "./pages/privacy/Privacy";
import CookiePreferences from "./pages/cookies/CookiePreferences";
import CorporateInfo from "./pages/corporate/CorporateInfo";
import About from "./pages/About";
import Careers from "./pages/Careers";
import ManageProfile from "./pages/ManageProfile";
import AccountSettings from "./pages/AccountSettings";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import PopularPage from "./pages/PopularPage";
import MyListPage from "./pages/MyListPage";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();
  const { loadWatchlist } = useWatchlistStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user, loadWatchlist]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/watch/:id"
          element={user ? <WatchPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/history"
          element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/movies"
          element={user ? <MoviesPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/tv-shows"
          element={user ? <TVShowsPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/popular"
          element={user ? <PopularPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/my-list"
          element={user ? <MyListPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/manage-profile"
          element={user ? <ManageProfile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/account-settings"
          element={user ? <AccountSettings /> : <Navigate to={"/login"} />}
        />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<CookiePreferences />} />
        <Route path="/corporate" element={<CorporateInfo />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Footer />

      <Toaster />
    </>
  );
}

export default App;
