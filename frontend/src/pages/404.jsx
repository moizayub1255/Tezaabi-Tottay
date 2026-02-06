import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFoundPage = () => {
  return (
    <div>
    <Navbar/>
      <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{ backgroundImage: `url('/404.png')` }}>
    

      <main className="text-center error-page--content z-10 px-4">
        <h1 className="text-6xl md:text-7xl font-semibold mb-4">
          Lost your way?
        </h1>
        <p className="mb-6 text-lg md:text-xl text-gray-300 max-w-xl">
          We couldn't find the page you're looking for. Try returning to the
          home page or use the navigation to continue browsing.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-white text-black py-2 px-4 rounded font-semibold"
          >
            Home
          </Link>
          <Link
            to="/help"
            className="border border-gray-600 text-gray-200 py-2 px-4 rounded hover:border-gray-400"
          >
            Visit Help Center
          </Link>
        </div>
      </main>
    </div>
    </div>
  );
};

export default NotFoundPage;
