'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaTools} from 'react-icons/fa';
import {toast, ToastContainer} from 'react-toastify';

// Mock data for jobs - in a real app, fetch from API
const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced frontend developer with strong React skills to join our team.",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        requirements: {
            age: "18+",
            skills: ["React", "TypeScript", "CSS", "HTML"]
        },
        deadline: "2025-12-31",
        tags: ["Remote", "Full-time", "Senior"]
    },
    {
        id: 2,
        title: "Backend Engineer",
        description: "Seeking a skilled backend engineer to develop and maintain our server infrastructure.",
        location: "New York, NY",
        salary: "$110,000 - $140,000",
        requirements: {
            age: "18+",
            skills: ["Node.js", "Python", "SQL", "MongoDB"]
        },
        deadline: "2025-12-15",
        tags: ["On-site", "Full-time"]
    },
    {
        id: 3,
        title: "UI/UX Designer",
        description: "Join our creative team as a UI/UX designer to create beautiful and functional user interfaces.",
        location: "Remote",
        salary: "$90,000 - $120,000",
        requirements: {
            age: "18+",
            skills: ["Figma", "Adobe XD", "User Research", "Prototyping"]
        },
        deadline: "2025-11-30",
        tags: ["Remote", "Contract"]
    }
];

export default function RecruiterDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState(mockJobs);

    // Uncomment this for production
    // useEffect(() => {
    //   const token = localStorage.getItem('token');
    //   const role = localStorage.getItem('role');
    //
    //   if (!token || role !== 'recruiter') {
    //     router.push('/login');
    //   }
    // }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    useEffect(() => {
        const storedJobs = localStorage.getItem('recruiterJobs');
        if (storedJobs) {
            const parsedJobs = JSON.parse(storedJobs);
            // Combine mock jobs with stored jobs
            setJobs([...mockJobs, ...parsedJobs]);
        }
    }, []);

    const handleDeleteJob = (id: number) => {
        if (confirm('Are you sure you want to delete this job posting?')) {
            // Filter out the job to delete
            const updatedJobs = jobs.filter(job => job.id !== id);
            setJobs(updatedJobs);

            // Update localStorage
            const storedJobs = updatedJobs.filter(job => !mockJobs.some(mockJob => mockJob.id === job.id));
            localStorage.setItem('recruiterJobs', JSON.stringify(storedJobs));

            toast.success('Job deleted successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000}/>
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 mr-10">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">JF</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">Job Finder</span>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-800">Recruiter Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Your Posted Jobs</h2>
                    <Link href="/dashboard/recruiter/create-job" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center">
                        <FaPlus className="mr-2"/> Post New Job
                    </Link>
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{job.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaMapMarkerAlt className="mr-2 text-blue-600"/>
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaDollarSign className="mr-2 text-green-600"/>
                                        {job.salary}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaCalendarAlt className="mr-2 text-red-600"/>
                                        Deadline: {job.deadline}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-start text-sm text-gray-600">
                                        <FaTools className="mr-2 mt-1 text-gray-600"/>
                                        <div>
                                            <span className="font-medium">Skills:</span> {job.requirements.skills.join(", ")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                                    ))}
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        href={`/dashboard/recruiter/job/${job.id}`}
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm text-center"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded"
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}