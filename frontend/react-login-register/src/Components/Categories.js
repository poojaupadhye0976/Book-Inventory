import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode package

// Function to get the Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ genreName: "", description: "" });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Function to get the user ID from the token
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

  // Fetch categories specific to the logged-in user
  const fetchCategories = async () => {
    if (!userId) {
      console.error("User ID not found. Please log in.");
      setLoading(false);
      return; // Stop fetching if userId is null
    }

    try {
      const response = await fetch(`http://localhost:8082/genres/user/${userId}`, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched categories:", data); // Log the fetched data
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (newCategory.genreName) {
      if (!userId) {
        console.error("User ID not found. Please log in.");
        return; // Stop the operation if no user ID is available
      }

      const categoryData = {
        genreName: newCategory.genreName,
        description: newCategory.description,
        user: {
          userId: userId, // Include user ID in the request body
        },
      };

      try {
        const response = await fetch("http://localhost:8082/genres", {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData), // Send the new category as JSON
        });
        if (response.ok) {
          const newGenre = await response.json();
          setCategories((prevCategories) => [...prevCategories, newGenre]);
          setNewCategory({ genreName: "", description: "" }); // Reset the input fields
        } else {
          console.error("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:8082/genres/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (response.ok) {
        // Remove the deleted category from state
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.genreId !== id)
        );
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Handle category editing
  const handleEditCategory = (id) => {
    const newName = prompt("Enter a new name for the category:");
    const newDescription = prompt("Enter a new description for the category:");
    if (newName && newDescription) {
      fetch(`http://localhost:8082/genres/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreName: newName, description: newDescription }), // Adjusted request body
      })
        .then((response) => response.json())
        .then((updatedCategory) => {
          if (updatedCategory && updatedCategory.genreId) {
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.genreId === updatedCategory.genreId ? updatedCategory : category
              )
            );
          } else {
            console.error("Failed to update category.");
          }
        })
        .catch((error) => console.error("Error editing category:", error));
    }
  };

  // Fetch categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.genreName.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#FFF9DB", minHeight: "100vh", padding: "20px" }}>
      <div
        className="container"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 className="text-center" style={{ color: "#4B0082" }}>
          Categories
        </h2>
        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : !userId ? (
          <p className="text-center">Please log in to view your categories.</p>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Search Categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{
                  width: "300px",
                  margin: "0 auto",
                  borderRadius: "8px",
                }}
              />
            </div>
            <table
              className="table table-striped"
              style={{
                border: "1px solid #DDD",
                marginBottom: "20px",
                backgroundColor: "#F9F9F9",
              }}
            >
              <thead style={{ backgroundColor: "#4B0082", color: "#FFFFFF" }}>
                <tr>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.genreId}>
                    <td>{category.genreId}</td>
                    <td>{category.genreName}</td>
                    <td>{category.description}</td>
                    <td>
                      <button
                        onClick={() => handleEditCategory(category.genreId)}
                        className="btn btn-sm btn-primary"
                        style={{ marginRight: "8px", borderRadius: "4px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.genreId)}
                        className="btn btn-sm btn-danger"
                        style={{ borderRadius: "4px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <h3 className="text-center" style={{ color: "#4B0082" }}>
                Add New Category
              </h3>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.genreName}
                  onChange={(e) => setNewCategory({ ...newCategory, genreName: e.target.value })}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                />
              </div>
              <button
                onClick={handleAddCategory}
                className="btn btn-success btn-lg"
                style={{
                  backgroundColor: "#4B0082",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                }}
              >
                Add Category
              </button>
            </div>
          </>
        )}
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

export default Categories;
