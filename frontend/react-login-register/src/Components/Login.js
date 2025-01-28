import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const [password, setPasswordValue] = useState("");
    const [email, setEmailValue] = useState("");
    const navigate = useNavigate();

    const setPassword = (e) => {
        setPasswordValue(e.target.value);
    };

    const setEmail = (e) => {
        setEmailValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        };

        try {
            const response = await fetch("http://localhost:8082/loginUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (responseData.message === "Invalid email or password") {
                toast.error("Invalid User ID or Password");
            } else {
                const token = responseData.token;
                localStorage.setItem('token', token);
                const decodedToken = jwtDecode(token);
                toast.success("Login Successful");
                navigate("/dashboard", { state: { message: "Login Successful" } });
            }
        } catch (error) {
            console.log("Error during login:", error);
            toast.error("An error occurred, please try again later.");
        }
    };

    const redirectToRegister = () => {
        window.location.href = "/register";
    };

    return (
        <div 
            className="container d-flex justify-content-center align-items-center" 
            style={{ backgroundColor: "#FFF9DB", minHeight: "100vh" }}
        >
            <div 
                className="row justify-content-center shadow-lg p-5" 
                style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", maxWidth: "600px", width: "100%" }}
            >
                <div className="col-12">
                    <h1 
                        className="text-center mb-4" 
                        style={{ color: "#4B0082", fontSize: "2rem", fontWeight: "bold" }}
                    >
                        Welcome to Tech Titan's Book Inventory
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">User ID:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control form-control-lg"
                                placeholder="Enter your user id"
                                name="email"
                                value={email}
                                onChange={setEmail}
                                style={{ borderRadius: "8px" }}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control form-control-lg"
                                placeholder="Enter your password"
                                name="pass"
                                value={password}
                                onChange={setPassword}
                                style={{ borderRadius: "8px" }}
                            />
                        </div>

                        <div className="text-center">
                            <button 
                                type="submit" 
                                className="btn btn-lg px-5" 
                                style={{ backgroundColor: "#4B0082", color: "#FFFFFF", border: "none", borderRadius: "8px" }}
                            >
                                Login
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <a 
                                href="#" 
                                className="text-decoration-none" 
                                onClick={redirectToRegister} 
                                style={{ color: "#4B0082", fontSize: "1rem" }}
                            >
                                Don't have an account?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
