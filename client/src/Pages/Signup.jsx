import React, { useEffect, useState, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import BlurFade from "@/components/magicui/blur-fade";
import FlickeringGrid from "@/components/magicui/flickering-grid.jsx";

function Signup() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        // Disable horizontal scrolling
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto'; // Allow vertical scrolling

        // Intersection Observer for fade-in effect
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Stop observing after it becomes visible
            }
        }, { threshold: 0.1 }); // Adjust threshold as needed

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        // Cleanup function to reset the overflow properties on unmount
        return () => {
            document.body.style.overflowX = 'auto';
            document.body.style.overflowY = 'auto';
        };
    }, []);

    useEffect(() => {
        // Disable horizontal scrolling
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto'; // Allow vertical scrolling

        // Intersection Observer for fade-in effect
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Stop observing after it becomes visible
            }
        }, { threshold: 0.1 }); // Adjust threshold as needed

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        // Cleanup function to reset the overflow properties on unmount
        return () => {
            document.body.style.overflowX = 'auto';
            document.body.style.overflowY = 'auto';
        };
    }, []);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [school, setSchool] = useState();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });

    const validatePassword = (password) => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
        });
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value.replace(/\s/g, ''); // Remove spaces
        setPassword(value);
        validatePassword(value);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value.replace(/\s/g, ''); // Remove spaces
        setConfirmPassword(value);
    };

    const handleSubmit = async e => {
        
        e.preventDefault();
        if (password === confirmPassword && Object.values(passwordRequirements).every(Boolean)) {
            const newUser = {
                _id: "",
                name: name,
                email: email,
                school: school,
                password: password,
                clubs: {}
            };
            try {
                const response = await fetch('/api/makeUser', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
          
                const data = await response.json();
                if (response.ok) {
                  console.log('User added:', data);
                  navigate('/login');
                } else {
                  console.error('Error:', data);
                }
            } catch (error) {
                console.error('Error sending user data:', error);
            }
            
        }
    };

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-r tw-from-blue-950 tw-to-blue-200 tw-py-8">
            <FlickeringGrid
                className="tw-z-0 tw-absolute tw-inset-0 tw-h-screen tw-w-screen"
                squareSize={3}
                gridGap={7}
                color="#6B7280"
                maxOpacity={0.5}
                flickerChance={0.1}
                height={870}
                width={2000}
            />
            <div ref={formRef} className="tw-z-10 tw-bg-blue-900 tw-shadow-lg tw-rounded-lg tw-p-8 tw-max-w-sm tw-w-full">
                <BlurFade inView={isVisible}>
                    <div>
                        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-text-white tw-mb-6">
                            Create Your Account
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="tw-mb-4">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div className="tw-mb-4">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="email">
                                    School Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="tw-mb-6">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="********"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="tw-mb-6">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                            </div>
                            <div className="tw-flex tw-items-center tw-mb-4">
                                <input
                                    type="checkbox"
                                    id="showPasswordCheckbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="tw-mr-2"
                                />
                                <label htmlFor="showPasswordCheckbox" className="tw-text-gray-300">Show Password</label>
                            </div>

                            {/* Password Requirement Prompts */}
                            <div className="tw-text-sm">
                                <p className={`tw-mb-1 ${passwordRequirements.length ? 'tw-text-green-500' : 'tw-text-red-500'}`}>
                                    {passwordRequirements.length ? '✓ Minimum 8 characters' : '✗ Minimum 8 characters'}
                                </p>
                                <p className={`tw-mb-1 ${passwordRequirements.uppercase ? 'tw-text-green-500' : 'tw-text-red-500'}`}>
                                    {passwordRequirements.uppercase ? '✓ At least 1 uppercase letter' : '✗ At least 1 uppercase letter'}
                                </p>
                                <p className={`tw-mb-1 ${passwordRequirements.lowercase ? 'tw-text-green-500' : 'tw-text-red-500'}`}>
                                    {passwordRequirements.lowercase ? '✓ At least 1 lowercase letter' : '✗ At least 1 lowercase letter'}
                                </p>
                                <p className={`tw-mb-1 ${passwordRequirements.number ? 'tw-text-green-500' : 'tw-text-red-500'}`}>
                                    {passwordRequirements.number ? '✓ At least 1 number' : '✗ At least 1 number'}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="tw-w-full tw-bg-blue-600 tw-text-white tw-font-semibold tw-p-3 tw-rounded-lg hover:tw-bg-blue-700 focus:outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-opacity-50"
                            >
                                Create
                            </button>
                        </form>
                        <p className="tw-mt-4 tw-text-center tw-text-gray-300">
                            Already have an account? <a href="/join" className="tw-text-blue-400 hover:tw-underline">Log in here.</a>
                        </p>
                    </div>
                </BlurFade>
            </div>
        </div>
    );
}

export default Signup;
