import AgentForm from "./AgentForm";
import AgentTasks from "./AgentTasks";

const Dashboard = () => {
  return (
    <main className="container mx-auto px-2 sm:px-4 py-4">
      <AgentForm />
      <AgentTasks />
    </main>
  );
};

export default Dashboard;
