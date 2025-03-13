import unauthorised from "/unauthorised.svg";
import { useNavigate } from "react-router-dom";

function UnAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center bg-gray-100  items-center h-screen px-4">
      <img
        src={unauthorised}
        alt="Unauthorized Access"
        className="w-full max-w-md md:max-w-lg object-cover"
      />
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
        Access Denied!
      </h2>
      <p className="text-gray-600 text-center mt-2">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-[#fc624d] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer"
      >
        Go Back Home
      </button>
    </div>
  );
}

export default UnAuthorized;
