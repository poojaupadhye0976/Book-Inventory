import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode"; 
function Dashboard() {
    const [acount ,setAuthorCount] =useState();
    const [bcount ,setBookCount] =useState();
    const [ccount ,setCategoryCount] =useState();
    const location = useLocation();
    const message = location.state?.message;

    // State for total counts
    const [counts, setCounts] = useState({
        totalAuthors: 0,
        totalBooks: 0,
        totalCategories: 0,
    });

    // Simulate user ID (replace this with actual logged-in user ID or token-based logic)
   const getUserIdFromToken = () => {
       const token = localStorage.getItem("token");
       if (token) {
         try {
           const decodedToken = jwtDecode(token); // Decode the JWT token
           console.log("Decoded Token:", decodedToken); // Debugging: Log the decoded token
           return decodedToken.userId || decodedToken.sub; // Adjust based on your token's structure
         } catch (error) {
           console.error("Error decoding token:", error);
           return null;
         }
       }
       console.warn("No token found in localStorage.");
       return null; // If no token found, return null
     };
   
     const userId = getUserIdFromToken(); // Get the user ID on component load
   

    // Fetch data on component mount
    useEffect(() => {
        if (message) {
            toast.success(message);
        }

        // Fetch total counts for the logged-in user
        const fetchCounts = async () => {
            try {
                // Fetch total authors for the user
                const authorsResponse = await fetch(`http://localhost:8082/authors/user/${userId}`);
                const authorsData = await authorsResponse.json();
                setAuthorCount(authorsData.length);
                // Fetch total books for the user
                const booksResponse = await fetch(`http://localhost:8082/books/user/${userId}`);
                // const Nbook = await booksResponse.json
                const booksData = await booksResponse.json();
                setBookCount(booksData.length);

                // Fetch total categories for the user
                const categoriesResponse = await fetch(`http://localhost:8082/genres/user/${userId}`);
                const categoriesData = await categoriesResponse.json();
                setCategoryCount(categoriesData.length);
                // Update state with fetched counts
                setCounts({
                    totalAuthors: authorsData.count,
                    totalBooks: booksData.count,
                    totalCategories: categoriesData.count,
                });
            } catch (error) {
                console.error("Error fetching counts:", error);
                toast.error("Failed to fetch data.");
            }
        };

        fetchCounts();
    }, [message, userId]);

    return (
        <div className="dashboard-container" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
            {/* Sidebar */}
            <div
                className="sidebar p-4"
                style={{
                    backgroundColor: "#F5F5F5",
                    color: "#5F4B8B",
                    width: "250px",
                    height: "100%",
                    borderRadius: "0 0 0 0",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    boxShadow: "4px 0px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h2
                    className="sidebar-title"
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.75rem",
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        color: "#5F4B8B",
                    }}
                >
                    Dashboard
                </h2>
                <ul className="sidebar-menu list-unstyled">
                    <li style={{ margin: "1rem 0" }}>
                        <Link
                            to="/authors"
                            className="sidebar-link"
                            style={{ color: "#5F4B8B", textDecoration: "none", fontSize: "1.2rem" }}
                        >
                            Authors
                        </Link>
                    </li>
                    <li style={{ margin: "1rem 0" }}>
                        <Link
                            to="/books"
                            className="sidebar-link"
                            style={{ color: "#5F4B8B", textDecoration: "none", fontSize: "1.2rem" }}
                        >
                            Books
                        </Link>
                    </li>
                    <li style={{ margin: "1rem 0" }}>
                        <Link
                            to="/categories"
                            className="sidebar-link"
                            style={{ color: "#5F4B8B", textDecoration: "none", fontSize: "1.2rem" }}
                        >
                            Categories
                        </Link>
                    </li>
                    <li style={{ margin: "1rem 0" }}>
                        <Link
                            to="/login"
                            className="sidebar-link"
                            style={{ color: "#5F4B8B", textDecoration: "none", fontSize: "1.2rem" }}
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div
                className="content p-5"
                style={{
                    marginLeft: "270px",
                    backgroundColor: "#FAF3E0",
                    
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h1
                    style={{
                        color: "#5F4B8B",
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        textAlign: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    Welcome to the Tech Titan's Dashboard
                </h1>
                <p style={{ color: "#5F4B8B", fontSize: "1.2rem", textAlign: "center", marginBottom: "2rem" }}>
                    Manage Authors, Books, and Categories here.
                </p>

                {/* Component Cards */}
                <div className="component-cards text-center" style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
                    <div
                        className="card p-4"
                        style={{
                            backgroundColor: "FFFFFF",
                            color: "#5F4B8B",
                            borderRadius: "16px",
                            width: "250px",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Total Authors</h3>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{acount}</p>
                    </div>

                    <div
                        className="card p-4"
                        style={{
                            backgroundColor: "#FFFFFF",
                            color: "#5F4B8B",
                            borderRadius: "16px",
                            width: "250px",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Total Books</h3>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{bcount}</p>
                    </div>

                    <div
                        className="card p-4"
                        style={{
                            backgroundColor: "#FFFFFF",
                            color: "#5F4B8B",
                            borderRadius: "16px",
                            width: "250px",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Total Categories</h3>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{ccount}</p>
                    </div>
                </div>

                <ToastContainer />

            </div>
            <footer style={{
        padding: '10px',
        backgroundColor: '#5F4B8B',
        textAlign: 'center',
        fontSize: '14px',
        color: 'white',
        borderTop: '1px solid #dee2e6',
        marginTop: 'auto',
        width: '100%',
        position: 'absolute',
        bottom: '0',
        left: '0',
      }}>
        <p><b>&copy; {new Date().getFullYear()} Pooja Upadhye</b></p>
      </footer>
        </div>
    );
}

export default Dashboard;
