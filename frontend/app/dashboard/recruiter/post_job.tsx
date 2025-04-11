import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-toastify";
import useTokenExpiry from "@/utils/useTokenExpiry";


export default function PostJob() {
  useTokenExpiry();
  const router = useRouter();
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    skills_required: ""
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8000/recruiter/job", job, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job posted successfully!");
      router.push("/recruiter");
    } catch (error) {
      toast.error("Failed to post job");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="skills_required"
          placeholder="Required Skills (comma-separated)"
          value={job.skills_required}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
}
