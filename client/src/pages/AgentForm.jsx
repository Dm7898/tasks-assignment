import { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import api from "../api/axiosInstance";

const AgentForm = () => {
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 3;
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const validateEmail = (email) => {
    console.log(email);
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|biz|info|io|co|us|in|uk)$/i;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const cleanedMobile = mobile.replace(/\D/g, "");
    if (cleanedMobile.startsWith("91") && cleanedMobile.length === 12) {
      mobile = cleanedMobile.slice(2);
    } else {
      mobile = cleanedMobile;
    }
    const indianMobileRegex = /^[6789]\d{9}$/;
    return indianMobileRegex.test(mobile);
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", mobile: "" };

    if (!validateEmail(newAgent.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!validateMobile(newAgent.mobile)) {
      newErrors.mobile =
        "Invalid mobile number! Must start with 6-9 and have 10 digits.";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      await api.post("/agents/add", newAgent);
      toast.success("Agent added successfully");
      fetchAgents();
      setNewAgent({ name: "", email: "", mobile: "", password: "" });
      setErrors({ email: "", mobile: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  //   const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);
  const sortedAgents = [...agents].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const currentAgents = sortedAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  const nextPage = () => {
    if (indexOfLastAgent < agents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard - Manage Agents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handleAddAgent}
          className="bg-white p-6 shadow-lg rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Add Agent</h3>
          <input
            type="text"
            placeholder="Name"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={newAgent.email}
            onChange={(e) =>
              setNewAgent({ ...newAgent, email: e.target.value })
            }
            className={`w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-1 focus:outline-none focus:ring-2 ${
              errors.email ? "focus:ring-red-500" : "focus:ring-gray-500"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          <div
            className={`w-full border ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } shadow-sm rounded-lg px-4 py-2 mb-3 focus-within:ring-2 ${
              errors.mobile
                ? "focus-within:ring-red-500"
                : "focus-within:ring-gray-500"
            }`}
          >
            <PhoneInput
              defaultCountry="in"
              value={newAgent.mobile}
              onChange={(value) => setNewAgent({ ...newAgent, mobile: value })}
              className="w-full"
              inputClass="w-full bg-transparent outline-none text-gray-600"
              inputStyle={{ border: "none", width: "100%", padding: "0" }}
            />
          </div>
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={newAgent.password}
            onChange={(e) =>
              setNewAgent({ ...newAgent, password: e.target.value })
            }
            className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />

          <button className="w-full bg-[#fc624d] text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer">
            Submit
          </button>
        </form>

        <div>
          <h3 className="text-xl font-bold text-gray-800 text-center md:text-left">
            Agents List
          </h3>
          <ul className="mt-2 space-y-2">
            {currentAgents.map((agent) => (
              <li key={agent._id} className="border p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div>
                    <span className="font-bold">Name:</span> {agent.name}
                  </div>
                  <div>
                    <span className="font-bold">Email:</span> {agent.email}
                  </div>

                  <div>
                    <span className="font-bold">Phone:</span> {agent.mobile}
                  </div>
                  <div>
                    <span className="font-bold">Phone:</span> {agent.password}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {agents.length > 0 && (
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-[#fc624d] hover:bg-[#fc614ddf] text-white rounded-[50%] flex items-center justify-center cursor-pointer"
              >
                &#8592;
              </button>
              <button
                onClick={nextPage}
                disabled={indexOfLastAgent >= agents.length}
                className="px-3 py-2 bg-[#fc624d] hover:bg-[#fc614ddf] text-white rounded-[50%] flex items-center justify-center cursor-pointer"
              >
                &#8594;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentForm;
