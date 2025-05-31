import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { API_URL } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        username: "",
        email: "",
        password: ""
    });

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;

        const errors = {
            username: !username ? "Username is required" : "",
            email: !email ? "Email is required" : !email.includes('@') ? "Please enter a valid email" : "",
            password: !password ? "Password is required" : password.length < 6 ? "Password must be at least 6 characters" : ""
        };

        setFormErrors(errors);

        if (Object.values(errors).some(error => error)) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/v1/signup`, {
                username,
                email,
                password
            });
            
            navigate("/signin");
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors?.length > 0) {
                setError(error.response.data.errors.map((e: any) => e.message).join(", "));
            } else {
                setError("Failed to sign up. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Create Your Account
                </h1>
                <div className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Input 
                        ref={usernameRef}
                        label="Username"
                        placeholder="Choose a username"
                        error={formErrors.username}
                    />
                    <Input 
                        ref={emailRef}
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={formErrors.email}
                    />
                    <Input 
                        ref={passwordRef}
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        error={formErrors.password}
                    />
                    
                    <div className="pt-4">
                        <Button 
                            onClick={signup} 
                            loading={loading} 
                            variant="primary" 
                            text="Sign Up" 
                            fullWidth={true} 
                        />
                    </div>
                    <p className="text-center text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-indigo-600 hover:text-indigo-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}