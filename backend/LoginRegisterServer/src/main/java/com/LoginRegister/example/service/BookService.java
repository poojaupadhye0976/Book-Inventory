package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.Book;
import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.BookRepository;
import com.LoginRegister.example.repository.UsersRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UsersRepo userRepository;

   // Add a new book
    public Book addBook(Book book) {
        Users user = userRepository.findById(book.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found."));
        book.setUser(user);
        return bookRepository.save(book);
    }

    // Get all books for a specific user
    public List<Book> getBooksByUserId(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return bookRepository.findByUser(user);
    }
    // Update an existing book
    public Book updateBook(Long bookId, Book updatedBook) {
    
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found."));
        Users user = userRepository.findById(updatedBook.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found."));

        // Ensure the book belongs to the same user
        if (!book.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access to update book.");
        }

        book.setTitle(updatedBook.getTitle());
        book.setPrice(updatedBook.getPrice());
        book.setQuantity(updatedBook.getQuantity());
        book.setUser(user);

        return bookRepository.save(book);
    }

    // Get a book by ID and User ID
    public Book getBookByIdAndUserId(Long bookId, Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        return bookRepository.findById(bookId)
                .filter(book -> book.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Book not found for this user."));
    }

    

    // Delete a book by ID and User ID
    public void deleteBookByUserId(Long bookId) {
        Book book = bookRepository.findById(bookId)
        		.orElseThrow(() -> new RuntimeException("Book not found or unauthorized access."));
//                .filter(b -> b.getUser().getUserId().equals(userId))
        bookRepository.delete(book);
    }

}
