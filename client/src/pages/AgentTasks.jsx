import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import UploadCSV from "./UploadCSV";
import { Phone, NotebookPen, Target } from "lucide-react";

const AgentTasks = () => {
  //from context api getting tasks,loading here
  const { tasks, loading, agentTaskCounts } = useContext(TaskContext);

  console.log(agentTaskCounts);
  // while fetching data we can show
  if (loading)
    return <p className="flex items-center justify-center">Loading...</p>;

  return (
    <section className="mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <UploadCSV />
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Assigned Tasks{" "}
          <span className="inline-block text-base font-normal text-gray-600">
            ({tasks.length || 0})
          </span>
        </h2>

        {/* Task Distribution Section */}
        {agentTaskCounts.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Task Distribution:
            </h3>
            <ul className="list-disc pl-5 text-gray-600 columns-2 md:columns-4 lg:columns-6 gap-2">
              {Object.entries(agentTaskCounts).map(([agent, data]) => (
                <li key={agent} className="mt-1">
                  <span className="font-medium text-gray-800">
                    {data.agentName}
                  </span>
                  :{" "}
                  <span className="font-bold text-gray-900">
                    {data.count || 0}
                  </span>{" "}
                  tasks
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No tasks assigned to agents yet.</p>
        )}

        {/* Task Cards */}
        {tasks.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition flex flex-col justify-between gap-1.5"
              >
                <div>
                  <p className="text-gray-900 font-semibold mb-2">
                    {task.firstname}
                  </p>
                  <p className="text-gray-700 text-sm flex gap-1 items-center">
                    <Phone size={16} /> {task.phone}
                  </p>
                  <p className="text-gray-600 italic text-sm mt-1 flex gap-1 items-center">
                    <NotebookPen size={16} className="text-orange-500" />{" "}
                    {task.notes}
                  </p>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#8d1cdd] flex gap-1 items-center">
                  <Target size={16} /> Assigned to:{" "}
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No tasks assigned yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default AgentTasks;
