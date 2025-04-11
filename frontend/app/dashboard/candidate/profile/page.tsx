'use client';

import {useState, useRef, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {FaUserCircle, FaFileAlt, FaEdit, FaUpload, FaTrash, FaSpinner, FaCheckCircle, FaArrowLeft} from 'react-icons/fa';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CandidateProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);

    // Profile state
    const [profile, setProfile] = useState({
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '(123) 456-7890',
        location: 'New York, NY',
        title: 'Senior Frontend Developer',
        about: 'Experienced developer with 5+ years of expertise in building responsive web applications using React, TypeScript, and modern frontend frameworks.',
        skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js'],
        experience: [
            {
                id: 1,
                role: 'Frontend Developer',
                company: 'Tech Solutions Inc.',
                duration: 'Jan 2021 - Present',
                description: 'Lead developer for e-commerce platform redesign.'
            },
            {
                id: 2,
                role: 'UI Developer',
                company: 'Digital Agency',
                duration: 'Mar 2018 - Dec 2020',
                description: 'Worked on various client projects using React and Vue.'
            }
        ],
        education: [
            {
                id: 1,
                degree: 'B.S. Computer Science',
                institution: 'Tech University',
                year: '2018'
            }
        ],
        resume: null as File | null,
        resumeName: 'jane_smith_resume.pdf',
        linkedIn: 'linkedin.com/in/janesmith',
        portfolio: 'janesmith.dev',
        github: 'github.com/janesmith'
    });

    useEffect(() => {
        // Load profile from localStorage if it exists
        const savedProfile = localStorage.getItem('candidateProfile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }

        // Load applications from localStorage
        const savedApplications = localStorage.getItem('candidateApplications');
        if (savedApplications) {
            setApplications(JSON.parse(savedApplications));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({
            ...prev,
            skills: e.target.value.split(',').map(skill => skill.trim())
        }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Simulate file processing
            await simulateFileProcessing();

            setProfile(prev => ({
                ...prev,
                resume: file,
                resumeName: file.name
            }));

            setUploadSuccess(true);
            toast.success('Resume uploaded successfully!');
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            toast.error('Failed to upload resume. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const simulateFileProcessing = (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('candidateProfile', JSON.stringify(profile));

        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleAddExperience = () => {
        setProfile(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                {
                    id: Date.now(),
                    role: '',
                    company: '',
                    duration: '',
                    description: ''
                }
            ]
        }));
    };

    const handleExperienceChange = (id: number, field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? {...exp, [field]: value} : exp
            )
        }));
    };

    const handleDeleteExperience = (id: number) => {
        setProfile(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const handleAddEducation = () => {
        setProfile(prev => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    id: Date.now(),
                    degree: '',
                    institution: '',
                    year: ''
                }
            ]
        }));
    };

    const handleEducationChange = (id: number, field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? {...edu, [field]: value} : edu
            )
        }));
    };

    const handleDeleteEducation = (id: number) => {
        setProfile(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const handleDeleteApplication = (index: number) => {
        if (confirm('Are you sure you want to delete this application?')) {
            const updatedApplications = [...applications];
            updatedApplications.splice(index, 1);
            setApplications(updatedApplications);
            localStorage.setItem('candidateApplications', JSON.stringify(updatedApplications));
            toast.success('Application deleted successfully.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000}/>

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Link href="/dashboard/candidate" className="mr-4">
                            <FaArrowLeft className="text-gray-600"/>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-800">Your Profile</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                            >
                                <FaEdit className="mr-2"/> Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                            >
                                <FaCheckCircle className="mr-2"/> Save Changes
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={profile.title}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                                <textarea
                                    name="about"
                                    value={profile.about}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={profile.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                                    <button
                                        type="button"
                                        onClick={handleAddExperience}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        + Add Experience
                                    </button>
                                </div>

                                {profile.experience.map((exp) => (
                                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium">Experience Details</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExperience(exp.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={exp.role}
                                                    onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Duration</label>
                                            <input
                                                type="text"
                                                value={exp.duration}
                                                onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)}
                                                placeholder="e.g. Jan 2020 - Present"
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Description</label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Education</label>
                                    <button
                                        type="button"
                                        onClick={handleAddEducation}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        + Add Education
                                    </button>
                                </div>

                                {profile.education.map((edu) => (
                                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium">Education Details</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEducation(edu.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500">Degree</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Institution</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Year</label>
                                            <input
                                                type="text"
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800">Online Profiles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                        <input
                                            type="text"
                                            name="linkedIn"
                                            value={profile.linkedIn}
                                            onChange={handleChange}
                                            placeholder="linkedin.com/in/username"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                                        <input
                                            type="text"
                                            name="portfolio"
                                            value={profile.portfolio}
                                            onChange={handleChange}
                                            placeholder="yourwebsite.com"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                        <input
                                            type="text"
                                            name="github"
                                            value={profile.github}
                                            onChange={handleChange}
                                            placeholder="github.com/username"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isUploading}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                                    >
                                        {isUploading ? (
                                            <FaSpinner className="animate-spin mr-2"/>
                                        ) : (
                                            <FaUpload className="mr-2"/>
                                        )}
                                        {profile.resumeName ? 'Replace Resume' : 'Upload Resume'}
                                    </button>
                                    {profile.resumeName && (
                                        <span className="ml-3 text-sm text-gray-600">
                      Current: {profile.resumeName}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3 flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <FaUserCircle className="text-white text-5xl"/>
                                    </div>
                                    <h3 className="text-xl font-bold">{profile.fullName}</h3>
                                    <p className="text-gray-600">{profile.title}</p>
                                    <p className="text-gray-600">{profile.location}</p>

                                    <div className="mt-4 w-full">
                                        <p className="text-sm text-gray-600 flex items-center mb-1">
                                            <span className="font-medium mr-2">Email:</span>
                                            {profile.email}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <span className="font-medium mr-2">Phone:</span>
                                            {profile.phone}
                                        </p>
                                    </div>

                                    {profile.resumeName && (
                                        <div className="mt-4 w-full">
                                            <p className="text-sm font-medium mb-1">Resume</p>
                                            <div className="flex items-center bg-blue-50 p-2 rounded">
                                                <FaFileAlt className="text-blue-600 mr-2"/>
                                                <span className="text-sm text-blue-700">{profile.resumeName}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-2/3 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">About Me</h3>
                                        <p className="text-gray-700">{profile.about}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                          {skill}
                        </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Experience</h3>
                                        <div className="space-y-4">
                                            {profile.experience.map((exp, index) => (
                                                <div key={index} className="border-l-2 border-blue-600 pl-4 py-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium">{exp.role}</h4>
                                                        <span className="text-sm text-gray-600">{exp.duration}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800">{exp.company}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Education</h3>
                                        <div className="space-y-3">
                                            {profile.education.map((edu, index) => (
                                                <div key={index} className="flex justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{edu.degree}</h4>
                                                        <p className="text-sm text-gray-800">{edu.institution}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{edu.year}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Online Profiles</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            {profile.linkedIn && (
                                                <a href={`https://${profile.linkedIn}`} target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-600 hover:underline text-sm">
                                                    LinkedIn: {profile.linkedIn}
                                                </a>
                                            )}
                                            {profile.portfolio && (
                                                <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-600 hover:underline text-sm">
                                                    Portfolio: {profile.portfolio}
                                                </a>
                                            )}
                                            {profile.github && (
                                                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-600 hover:underline text-sm">
                                                    GitHub: {profile.github}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Applications Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Applications</h2>

                    {applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((application, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{application.jobTitle}</h3>
                                            <p className="text-sm text-gray-600">
                                                Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteApplication(index)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                            title="Delete application"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <p><span className="font-medium">Resume:</span> {application.resumeFileName}</p>
                                            {application.linkedIn && (
                                                <p><span className="font-medium">LinkedIn:</span> {application.linkedIn}</p>
                                            )}
                                        </div>

                                        {application.coverLetter && (
                                            <div className="mt-3">
                                                <p className="font-medium text-sm">Cover Letter:</p>
                                                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{application.coverLetter}</p>
                                            </div>
                                        )}

                                        <div className="mt-3 flex justify-end">
                                            <Link
                                                href={`/dashboard/candidate/job/${application.jobId}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Job Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>You haven't submitted any job applications yet.</p>
                            <Link
                                href="/dashboard/candidate"
                                className="text-blue-600 font-medium hover:text-blue-800 mt-2 inline-block"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}