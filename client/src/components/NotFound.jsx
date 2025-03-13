import { useNavigate } from "react-router-dom";
import notFoundImage from "/notfound.svg";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
      <img
        src={notFoundImage}
        alt="Page Not Found"
        className="w-full max-w-md md:max-w-lg object-cover"
      />
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 text-center mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-[#fc624d] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer"
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;
