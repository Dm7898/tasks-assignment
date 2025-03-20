import { useState, useEffect, useContext } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/authContext";

const AgentForm = () => {
  const { user } = useContext(AuthContext);
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
  //fecth agents onload
  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  // console.log(user);
  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents", {
        params: { adminId: user.userId },
      });
      setAgents(res.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };
  //validate email
  const validateEmail = (email) => {
    console.log(email);
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|biz|info|io|co|us|in|uk)$/i;
    return emailRegex.test(email);
  };
  //va;idate mobile number
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
  // console.log(user.userId);
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
    // post data to backend

    try {
      await api.post("/agents/add", {
        ...newAgent,
        adminId: user?.userId,
      });
      toast.success("Agent added successfully");
      fetchAgents();
      // console.log(res.data);
      setNewAgent({ name: "", email: "", mobile: "", password: "" });
      setErrors({ email: "", mobile: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };
  //pageniation
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
    // <section className="">
    //   <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    //     Admin Dashboard - Manage Agents
    //   </h2>
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     <form
    //       onSubmit={handleAddAgent}
    //       className="bg-white p-6 shadow-lg rounded-lg"
    //     >
    //       <h3 className="text-xl font-semibold mb-4">Add Agent</h3>
    //       <input
    //         type="text"
    //         placeholder="Name"
    //         value={newAgent.name}
    //         onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
    //         className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
    //         required
    //       />

    //       <input
    //         type="email"
    //         placeholder="Email"
    //         value={newAgent.email}
    //         onChange={(e) =>
    //           setNewAgent({ ...newAgent, email: e.target.value })
    //         }
    //         className={`w-full border ${
    //           errors.email ? "border-red-500" : "border-gray-300"
    //         } shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-1 focus:outline-none focus:ring-2 ${
    //           errors.email ? "focus:ring-red-500" : "focus:ring-gray-500"
    //         }`}
    //         required
    //       />
    //       {/* shows error  */}
    //       {errors.email && (
    //         <p className="text-red-500 text-sm mb-2">{errors.email}</p>
    //       )}

    //       <div
    //         className={`w-full border ${
    //           errors.mobile ? "border-red-500" : "border-gray-300"
    //         } shadow-sm rounded-lg px-4 py-2 mb-3 focus-within:ring-2 ${
    //           errors.mobile
    //             ? "focus-within:ring-red-500"
    //             : "focus-within:ring-gray-500"
    //         }`}
    //       >
    //         <PhoneInput
    //           defaultCountry="in"
    //           value={newAgent.mobile}
    //           onChange={(value) => setNewAgent({ ...newAgent, mobile: value })}
    //           className="w-full"
    //           inputClass="w-full bg-transparent outline-none text-gray-600"
    //           inputStyle={{ border: "none", width: "100%", padding: "0" }}
    //         />
    //       </div>
    //       {errors.mobile && (
    //         <p className="text-red-500 text-sm">{errors.mobile}</p>
    //       )}

    //       <input
    //         type="password"
    //         placeholder="Password"
    //         value={newAgent.password}
    //         onChange={(e) =>
    //           setNewAgent({ ...newAgent, password: e.target.value })
    //         }
    //         className="w-full border border-gray-300 shadow-sm text-gray-600 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
    //         required
    //       />

    //       <button className="w-full bg-[#fc624d] text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition-all cursor-pointer">
    //         Submit
    //       </button>
    //     </form>
    //     {/* agents list */}
    //     <div>
    //       <h3 className="text-xl font-bold text-gray-800 text-center md:text-left">
    //         Agents List
    //       </h3>
    //       <ul className="mt-2 space-y-2">
    //         {currentAgents.map((agent) => (
    //           <li key={agent._id} className="border p-4 rounded-lg shadow">
    //             <div className="grid grid-cols-1 lg:grid-cols-2">
    //               <div>
    //                 <span className="font-bold">Name:</span> {agent.name}
    //               </div>
    //               <div>
    //                 <span className="font-bold">Email:</span> {agent.email}
    //               </div>

    //               <div>
    //                 <span className="font-bold">Phone:</span> {agent.mobile}
    //               </div>
    //               <div>
    //                 <span className="font-bold">Phone:</span> {agent.password}
    //               </div>
    //             </div>
    //           </li>
    //         ))}
    //       </ul>
    //       {/* pageniation */}
    //       {agents.length > 0 && (
    //         <div className="flex justify-center gap-2 mt-3">
    //           <button
    //             onClick={prevPage}
    //             disabled={currentPage === 1}
    //             className="px-3 py-2 bg-[#fc624d] hover:bg-[#fc614ddf] text-white rounded-[50%] flex items-center justify-center cursor-pointer"
    //           >
    //             &#8592;
    //           </button>
    //           <button
    //             onClick={nextPage}
    //             disabled={indexOfLastAgent >= agents.length}
    //             className="px-3 py-2 bg-[#fc624d] hover:bg-[#fc614ddf] text-white rounded-[50%] flex items-center justify-center cursor-pointer"
    //           >
    //             &#8594;
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </section>
    <section className="">
      {/* Page Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard - Manage Agents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Agent Form */}
        <form
          onSubmit={handleAddAgent}
          className="bg-white p-6 shadow-lg rounded-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Add Agent
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAgent.name}
              onChange={(e) =>
                setNewAgent({ ...newAgent, name: e.target.value })
              }
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8d1cdd]"
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
              } text-gray-700 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-[#8d1cdd]"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <div
              className={`w-full border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 ${
                errors.mobile
                  ? "focus-within:ring-red-500"
                  : "focus-within:ring-[#8d1cdd]"
              }`}
            >
              <PhoneInput
                defaultCountry="in"
                value={newAgent.mobile}
                onChange={(value) =>
                  setNewAgent({ ...newAgent, mobile: value })
                }
                className="w-full"
                inputClass="w-full bg-transparent outline-none text-gray-700"
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
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8d1cdd]"
              required
            />

            <button className="w-full lightpink font-semibold py-3 rounded-lg shadow-md transition-all hover:cursor-pointer">
              Add Agent
            </button>
          </div>
        </form>

        {/* Agents List */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 text-center md:text-left">
            Agents List
          </h3>
          <ul className="mt-4 space-y-2">
            {currentAgents.map((agent) => (
              <li
                key={agent._id}
                className="border border-gray-200 p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold text-gray-700">Name:</span>{" "}
                    {agent.name}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    {agent.email}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    {agent.mobile}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Password:
                    </span>{" "}
                    {agent.password}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {agents.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 lightpink rounded-full shadow-md  disabled:opacity-50 transition-all"
              >
                &#8592;
              </button>
              <button
                onClick={nextPage}
                disabled={indexOfLastAgent >= agents.length}
                className="px-3 py-2 lightpink rounded-full shadow-md  disabled:opacity-50 transition-all"
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
