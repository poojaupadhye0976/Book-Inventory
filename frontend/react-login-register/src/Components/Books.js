import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    authorId: "",
    genreId: "",
    price: "",
    quantity: "",
  });
  const [bookToEdit, setBookToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  // State for search query

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

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const [booksResponse, authorsResponse, genresResponse] = await Promise.all([
        fetch(`http://localhost:8082/books/user/${userId}`, {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }),
        fetch("http://localhost:8082/authors", {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }),
        fetch("http://localhost:8082/genres", {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!booksResponse.ok || !authorsResponse.ok || !genresResponse.ok) {
        throw new Error("Failed to fetch data.");
      }

      const booksData = await booksResponse.json();
      const authorsData = await authorsResponse.json();
      const genresData = await genresResponse.json();

      setBooks(booksData);
      setAuthors(authorsData);
      setGenres(genresData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); 

  const handleAuthorChange = (e) => {
    setNewBook({ ...newBook, authorId: e.target.value });
  };

  const handleGenreChange = (e) => {
    setNewBook({ ...newBook, genreId: e.target.value });
  };

  const handleAddBook = async () => {
    const requestBody = {
      title: newBook.title,
      author: { authorId: newBook.authorId },
      genre: { genreId: newBook.genreId },
      user: { userId: userId },
      price: parseFloat(newBook.price),
      quantity: parseInt(newBook.quantity),
    };

    setFormLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8082/books", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const addedBook = await response.json();

      const authorName = authors.find((author) => author.authorId === newBook.authorId)?.authorName;
      const genreName = genres.find((genre) => genre.genreId === newBook.genreId)?.genreName;

      const bookWithNames = {
        ...addedBook,
        author: { ...addedBook.author, authorName },
        genre: { ...addedBook.genre, genreName },
      };

      setBooks([...books, bookWithNames]);
      setNewBook({
        title: "",
        authorId: "",
        genreId: "",
        price: "",
        quantity: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
      window.location.reload();
    }
  };

  const handleEditClick = (book) => {
    setBookToEdit(book);
    setNewBook({
      title: book.title,
      authorId: book.author.authorId,
      genreId: book.genre.genreId,
      price: book.price,
      quantity: book.quantity,
    });
  };

  const handleEditBook = async () => {
    const requestBody = {
      bookId: bookToEdit.bookId,
      title: newBook.title,
      price: parseFloat(newBook.price),
      quantity: parseInt(newBook.quantity),
      author: { authorId: newBook.authorId },
      genre: { genreId: newBook.genreId },
      user: { userId: userId },
    };

    setFormLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8082/books/update/${bookToEdit.bookId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookId === updatedBook.bookId ? updatedBook : book
          )
        );
        setBookToEdit(null);
        setNewBook({
          title: "",
          authorId: "",
          genreId: "",
          price: "",
          quantity: "",
        });
      } else {
        throw new Error("Failed to update book.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    setFormLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8082/books/delete/${bookId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks(books.filter((book) => book.bookId !== bookId));
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to filter books based on the search query
  const filteredBooks = books.filter((book) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().startsWith(lowerCaseQuery)
    );
  });

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
        <h2 className="text-center" style={{ color: "#4B0082" }}>Books</h2>

        {/* Search bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search by book name, author name, or genre name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #DDD",
            }}
          />
        </div>
        <div>
              <h3 className="text-center" style={{ color: "#4B0082" }}>
                {bookToEdit ? "Edit Book" : "Add New Book"}
              </h3>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Book Title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                />
                <select
                  value={newBook.authorId}
                  onChange={handleAuthorChange}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                >
                  <option value="">Select Author</option>
                  {authors.map((author) => (
                    <option key={author.authorId} value={author.authorId}>
                      {author.authorName}
                    </option>
                  ))}
                </select>
                <select
                  value={newBook.genreId}
                  onChange={handleGenreChange}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre.genreId} value={genre.genreId}>
                      {genre.genreName}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newBook.quantity}
                  onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })}
                  className="form-control"
                  style={{ marginBottom: "10px", borderRadius: "8px" }}
                />
                <div className="text-center">
                  <button
                    onClick={bookToEdit ? handleEditBook : handleAddBook}
                    className="btn btn-primary"
                    disabled={formLoading}
                    style={{ borderRadius: "8px" }}
                  >
                    {formLoading ? "Processing..." : bookToEdit ? "Update Book" : "Add Book"}
                  </button>
                </div>
              </div>
            </div>

        {loading ? (
          <p className="text-center">Loading books...</p>
        ) : error ? (
          <p className="text-center" style={{ color: "red" }}>{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center">No books found. Add your first book below!</p>
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
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.title}</td>
                    <td>{book.author.authorName}</td>
                    <td>{book.genre.genreName}</td>
                    <td>{book.price}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(book)}
                        className="btn btn-sm btn-primary"
                        style={{ marginRight: "8px", borderRadius: "4px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.bookId)}
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

export default Books;
