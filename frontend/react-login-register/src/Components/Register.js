import React from "react";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Register() {
    const [register, setRegister] = React.useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(register);
        try {
            const response = await fetch("http://localhost:8082/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(register),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response Data:", responseData);
                toast.success("User registered successfully");

                // Navigate to the login page after successful registration
                navigate("/login");
            } else {
                toast.error("Error registering user");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An error occurred, please try again later.");
        }
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
                            <label htmlFor="username" className="form-label">Name:</label>
                            <input
                                type="text"
                                id="username"
                                name="name"
                                placeholder="Enter your name"
                                value={register.name}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                style={{ borderRadius: "8px" }}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={register.email}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                style={{ borderRadius: "8px" }}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={register.password}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                style={{ borderRadius: "8px" }}
                            />
                        </div>

                        <div className="text-center">
                            <button 
                                type="submit" 
                                className="btn btn-lg px-5" 
                                style={{ backgroundColor: "#4B0082", color: "#FFFFFF", border: "none", borderRadius: "8px" }}
                            >
                                Register
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <a 
                                href="/login" 
                                className="text-decoration-none" 
                                style={{ color: "#4B0082", fontSize: "1rem" }}
                            >
                                Already have an account?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Register;
