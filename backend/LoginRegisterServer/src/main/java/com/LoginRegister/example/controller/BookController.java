package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.Book;
import com.LoginRegister.example.service.BookService;
import com.LoginRegister.example.util.JwtUtil; // Ensure that you import JwtUtil
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;
    
    @Autowired
    private JwtUtil jwtUtils; // Missing semicolon here

    // Add a new book
    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book, @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader != null && authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : null;

        // Validate the token
        if (token == null || !jwtUtils.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        return ResponseEntity.ok(bookService.addBook(book)); // Proper ResponseEntity usage
    }

    // Update an existing book
    @PutMapping("/update/{id}")
    public Book updateBook(@PathVariable("id") Long bookId, @RequestBody Book book) {
        return bookService.updateBook(bookId, book);
    }

    // Get a book by ID (user-specific)
    @GetMapping("/getbyid/{id}/{userId}")
    public Book getBookById(@PathVariable("id") Long bookId, @PathVariable("userId") Long userId) {
        return bookService.getBookByIdAndUserId(bookId, userId);
    }

    // Get all books for a user
    @GetMapping("/user/{userId}")
    public List<Book> getBooksByUserId(@PathVariable("userId") Long userId) {
        return bookService.getBooksByUserId(userId);
    }

    // Delete a book by ID (user-specific)
    @DeleteMapping("/delete/{id}")
    public void deleteBook(@PathVariable("id") Long bookId) {
        bookService.deleteBookByUserId(bookId);
    }
 
 
}
