import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { TaskContext } from "../context/TaskContext";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/authContext";

const UploadCSV = () => {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const { fetchTasks, fetchAgentTaskCounts } = useContext(TaskContext);
  const [loading, setLoading] = useState(false);

  //file checks
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file) {
      handleUpload(file);
    }
  };
  //button triggers input file
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };
  //send data to backend
  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("adminId", user?.userId);

    try {
      await api.post("/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded and tasks distributed successfully");

      // Refresh tasks after successful upload
      fetchTasks();
      fetchAgentTaskCounts();
    } catch (error) {
      toast.error(
        "csv, xlsx, xls files are allowed & duplicates tasks are not allowed!"
      );
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mb-2 justify-between items-center">
      <p>Upload file to assign tasks</p>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={triggerFileSelect}
          disabled={loading}
          className="w-full lightpink font-bold py-2 px-4 rounded-lg  transition cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default UploadCSV;
