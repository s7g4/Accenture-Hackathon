'use client';

import {useState, useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import Link from 'next/link';
import {FaArrowLeft, FaEdit, FaSave, FaTrash} from 'react-icons/fa';

export default function JobDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id;

    // In a real application, you would fetch job data based on the ID
    // This is mock data for demonstration
    const [job, setJob] = useState({
        id: Number(jobId),
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced frontend developer with strong React skills to join our team.",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        requirements: {
            age: "18+",
            skills: ["React", "TypeScript", "CSS", "HTML"]
        },
        deadline: "2023-12-31",
        tags: ["Remote", "Full-time", "Senior"]
    });

    const [isEditing, setIsEditing] = useState(false);

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

    const handleSave = () => {
        // In a real application, make an API call to update the job
        console.log('Saving job:', job);
        setIsEditing(false);
        // Show success message
        alert('Job updated successfully!');
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            // In a real application, make an API call to delete the job
            console.log('Deleting job:', jobId);
            router.push('/dashboard/recruiter');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Link href="/dashboard/recruiter" className="mr-4">
                            <FaArrowLeft className="text-gray-600"/>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {isEditing ? 'Edit Job Posting' : 'Job Details'}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    {isEditing ? (
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={job.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={job.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={job.location}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={job.salary}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={job.deadline}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Skills Required (comma separated)</label>
                                <input
                                    type="text"
                                    value={job.requirements.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={job.tags.join(', ')}
                                    onChange={handleTagsChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <FaEdit className="mr-2"/> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <FaTrash className="mr-2"/> Delete
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-700">{job.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Location</h3>
                                    <p className="text-gray-700">{job.location}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Salary</h3>
                                    <p className="text-gray-700">{job.salary}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Requirements</h3>
                                    <p className="text-gray-700 mb-2">Age: {job.requirements.age}</p>
                                    <div>
                                        <p className="text-gray-700 mb-1">Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.requirements.skills.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Deadline</h3>
                                    <p className="text-gray-700">{job.deadline}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}