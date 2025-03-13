import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { TaskContext } from "../context/TaskContext";
import api from "../api/axiosInstance";

const UploadCSV = () => {
  const fileInputRef = useRef(null);
  const { fetchTasks } = useContext(TaskContext);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded and tasks distributed successfully");

      // Refresh tasks after successful upload
      fetchTasks();
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
          className="w-full bg-[#fc624d] text-[#ffffff] font-bold py-2 px-4 rounded-lg hover:bg-[#fc614de7] transition cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default UploadCSV;
