import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import UploadCSV from "./UploadCSV";

const AgentTasks = () => {
  const { tasks, loading } = useContext(TaskContext);
  if (loading)
    return <p className="flex items-center justify-center">Loading...</p>;
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <UploadCSV />
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Assigned Tasks{" "}
        <span className="inline-block text-base font-normal text-gray-600">
          ({tasks.length || 0})
        </span>
      </h2>
      {tasks.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border p-4 rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 transition"
            >
              <p className=" text-gray-900">Firstname:{task.firstname}</p>
              <p className="text-gray-700">Phone: {task.phone}</p>
              <p className="text-gray-600 italic">Notes: {task.notes}</p>
              <p className="mt-2 font-semibold text-[#fc624d]">
                Assigned to: {task.assignedTo?.name}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No tasks assigned yet.</p>
      )}
    </div>
  );
};

export default AgentTasks;
