import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [newAuthor, setNewAuthor] = useState({ authorName: "", biography: "" });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added search query state
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 8; // Number of authors per page

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId || decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const userId = getUserIdFromToken();

  const fetchAuthors = async () => {
    setLoading(true);
    setError("");
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/authors/user/${userId}`, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch authors. Please try again.");
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async () => {
    if (!newAuthor.authorName.trim()) {
      alert("Author Name is required.");
      return;
    }
    setFormLoading(true);
    setError("");
    const authorData = {
      authorName: newAuthor.authorName,
      biography: newAuthor.biography,
      user: { userId: userId },
    };

    try {
      const response = await fetch("http://localhost:8082/authors", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authorData),
      });
      if (response.ok) {
        const newAuthorResponse = await response.json();
        setAuthors((prevAuthors) => [...prevAuthors, newAuthorResponse]);
        setNewAuthor({ authorName: "", biography: "" });
      } else {
        throw new Error("Failed to add author. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAuthor = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this author?");
    if (!confirmDelete) return;

    setFormLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8082/authors/delete/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete author. Please try again.");
      }

      // Fetch authors again after deletion
      fetchAuthors();
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAuthor = (author) => {
    setAuthorToEdit(author);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!authorToEdit.authorName.trim()) {
      alert("Author Name is required.");
      return;
    }
    setFormLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8082/authors/update/${authorToEdit.authorId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName: authorToEdit.authorName,
          biography: authorToEdit.biography,
          user: { userId: userId },
        }),
      });

      if (response.ok) {
        const updatedAuthor = await response.json();
        setAuthors((prevAuthors) =>
          prevAuthors.map((author) =>
            author.authorId === updatedAuthor.authorId ? updatedAuthor : author
          )
        );
        setEditModalVisible(false);
        setAuthorToEdit(null);
      } else {
        throw new Error("Failed to update author. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const filteredAuthors = authors.filter((author) =>
    author.authorName.toLowerCase().startsWith(searchQuery.toLowerCase()) // Filter authors based on search query
  );

  // Pagination logic
  const paginatedAuthors = filteredAuthors.slice(
    (currentPage - 1) * authorsPerPage,
    currentPage * authorsPerPage
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
        <h2 className="text-center" style={{ color: "#4B0082" }}>Authors</h2>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{
              borderRadius: "8px",
              marginBottom: "20px",
              width: "100%",
            }}
          />
        </div>

        <div>
          <h3 className="text-center" style={{ color: "#4B0082" }}>Add New Author</h3>
          <input
            type="text"
            placeholder="Author Name"
            value={newAuthor.authorName}
            onChange={(e) => setNewAuthor({ ...newAuthor, authorName: e.target.value })}
            className="form-control"
            style={{ marginBottom: "10px", borderRadius: "8px" }}
          />
          <textarea
            placeholder="Biography"
            value={newAuthor.biography}
            onChange={(e) => setNewAuthor({ ...newAuthor, biography: e.target.value })}
            className="form-control"
            style={{ marginBottom: "10px", borderRadius: "8px" }}
          />
          <button
            onClick={handleAddAuthor}
            className="btn btn-success btn-block"
            disabled={formLoading}
            style={{ borderRadius: "8px",marginBottom:"8px" }}
          >
            {formLoading ? "Adding..." : "Add Author"}
          </button>
        </div>

        {/* Modal for editing author */}
        {editModalVisible && (
          <div className="modal" style={{ display: "block", position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div
              className="modal-content"
              style={{
                backgroundColor: "#FFFFFF",
                margin: "auto",
                padding: "20px",
                width: "50%",
                borderRadius: "8px",
              }}
            >
              <h3>Edit Author</h3>
              <input
                type="text"
                value={authorToEdit.authorName}
                onChange={(e) => setAuthorToEdit({ ...authorToEdit, authorName: e.target.value })}
                className="form-control"
                style={{ marginBottom: "10px", borderRadius: "8px" }}
              />
              <textarea
                value={authorToEdit.biography}
                onChange={(e) => setAuthorToEdit({ ...authorToEdit, biography: e.target.value })}
                className="form-control"
                style={{ marginBottom: "10px", borderRadius: "8px" }}
              />
              <div className="modal-footer">
                <button
                  onClick={handleSaveEdit}
                  className="btn btn-success"
                  style={{ borderRadius: "8px" }}
                  disabled={formLoading}
                >
                  {formLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="btn btn-secondary"
                  style={{ borderRadius: "8px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading authors...</p>
        ) : error ? (
          <p className="text-center" style={{ color: "red" }}>{error}</p>
        ) : paginatedAuthors.length === 0 ? (
          <p className="text-center">No authors found. Add your first author below!</p>
        ) : (
          <>
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
                  <th>Author ID</th>
                  <th>Name</th>
                  <th>Biography</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAuthors.map((author) => (
                  <tr key={author.authorId}>
                    <td>{author.authorId}</td>
                    <td>{author.authorName}</td>
                    <td>{author.biography}</td>
                    <td>
                      <button
                        onClick={() => handleEditAuthor(author)}
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: "4px", marginRight: "10px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author.authorId)}
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

            {/* Pagination Controls */}
            <div className="pagination" style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ borderRadius: "8px", marginRight: "5px" }}
              >
                Previous
              </button>
              <span style={{ marginRight: "10px" }}>
                Page {currentPage} of {Math.ceil(filteredAuthors.length / authorsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredAuthors.length / authorsPerPage)))}
                disabled={currentPage === Math.ceil(filteredAuthors.length / authorsPerPage)}
                className="btn btn-secondary"
                style={{ borderRadius: "8px" }}
              >
                Next
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

export default Authors;
