'use client';

import {useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {FaArrowLeft, FaFileUpload, FaCheckCircle, FaSpinner} from 'react-icons/fa';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

export default function CreateJobPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [job, setJob] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        requirements: {
            age: "18+",
            skills: [""]
        },
        deadline: "",
        tags: [""]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setJob(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJob(prev => ({
            ...prev,
            requirements: {
                ...prev.requirements,
                skills: e.target.value.split(',').map(skill => skill.trim())
            }
        }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJob(prev => ({
            ...prev,
            tags: e.target.value.split(',').map(tag => tag.trim())
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create a new job with ID
        const newJob = {
            ...job,
            id: Date.now() // Use timestamp as a simple unique ID
        };

        // Retrieve existing jobs from localStorage
        const existingJobsString = localStorage.getItem('recruiterJobs');
        const existingJobs = existingJobsString ? JSON.parse(existingJobsString) : [];

        // Add new job to the array
        const updatedJobs = [...existingJobs, newJob];

        // Save back to localStorage
        localStorage.setItem('recruiterJobs', JSON.stringify(updatedJobs));

        // Show success notification
        toast.success('Job posted successfully!');

        // Redirect after a brief delay
        setTimeout(() => {
            router.push('/dashboard/recruiter');
        }, 1500);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simulate file processing
        setIsUploading(true);

        try {
            // This is a mock function - in production, you'd send the file to your backend API
            await simulateFileProcessing(file);

            // Mock data that would come back from API after PDF processing
            setJob({
                title: "Senior Full Stack Developer",
                description: "We're seeking an experienced full-stack developer to join our growing team. You'll be responsible for developing and maintaining both frontend and backend systems, collaborating with cross-functional teams, and implementing best practices for code quality and performance.",
                location: "Chicago, IL (Hybrid)",
                salary: "$120,000 - $150,000",
                requirements: {
                    age: "18+",
                    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "AWS"]
                },
                deadline: "2023-12-15",
                tags: ["Hybrid", "Full-time", "Senior"]
            });

            setUploadSuccess(true);
            toast.success('Resume parsed successfully!');
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Failed to process the file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const simulateFileProcessing = (file: File): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000}/>
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Link href="/dashboard/recruiter" className="mr-4">
                            <FaArrowLeft className="text-gray-600"/>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-800">Create New Job</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    {/* PDF Upload Section */}
                    <div className="mb-8">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf"
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center space-y-2">
                                <FaFileUpload className="text-blue-500 text-3xl mb-2"/>
                                <h3 className="text-lg font-medium">Upload Job Description PDF</h3>
                                <p className="text-sm text-gray-500 mb-3">Upload a PDF and we'll automatically fill in the details</p>

                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    disabled={isUploading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <span className="flex items-center">
                                                        <FaSpinner className="animate-spin mr-2"/> Processing...
                                                    </span>
                                    ) : uploadSuccess ? (
                                        <span className="flex items-center">
                                                        <FaCheckCircle className="mr-2"/> Form Updated
                                                    </span>
                                    ) : (
                                        "Choose File"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={job.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description *</label>
                            <textarea
                                name="description"
                                value={job.description}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={job.location}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Salary *</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={job.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. $50,000 - $70,000"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Age Requirement</label>
                                <input
                                    type="text"
                                    name="age"
                                    value={job.requirements.age}
                                    onChange={(e) => setJob(prev => ({
                                        ...prev,
                                        requirements: {
                                            ...prev.requirements,
                                            age: e.target.value
                                        }
                                    }))}
                                    placeholder="e.g. 18+"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deadline *</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={job.deadline}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills Required (comma separated) *</label>
                            <input
                                type="text"
                                value={job.requirements.skills.join(', ')}
                                onChange={handleSkillsChange}
                                placeholder="e.g. JavaScript, React, CSS"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={job.tags.join(', ')}
                                onChange={handleTagsChange}
                                placeholder="e.g. Remote, Full-time, Entry-level"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                href="/dashboard/recruiter"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Post Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
