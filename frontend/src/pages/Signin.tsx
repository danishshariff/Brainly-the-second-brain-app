import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { API_URL } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        username: "",
        password: ""
    });

    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const errors = {
            username: !username ? "Username is required" : "",
            password: !password ? "Password is required" : ""
        };

        setFormErrors(errors);

        if (!username || !password) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/v1/signin`, {
                username,
                password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to sign in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back
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
                        placeholder="Enter your username"
                        error={formErrors.username}
                    />
                    <Input 
                        ref={passwordRef}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        error={formErrors.password}
                    />
                    <div className="pt-4">
                        <Button 
                            onClick={signin} 
                            loading={loading} 
                            variant="primary" 
                            text="Sign In" 
                            fullWidth={true} 
                        />
                    </div>
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 hover:text-indigo-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}