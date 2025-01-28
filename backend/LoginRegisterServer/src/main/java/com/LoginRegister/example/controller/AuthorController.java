package com.LoginRegister.example.controller;

import com.LoginRegister.example.entity.Author;
import com.LoginRegister.example.service.AuthorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    // Add a new author
    @PostMapping
    public Author addAuthor(@RequestBody Author author) {
        return authorService.addAuthor(author);
    }

    // Update an existing author
    @PutMapping("/update/{id}")
    public Author updateAuthor(@PathVariable("id") Long authorId, @RequestBody Author author) {
        return authorService.updateAuthor(authorId, author);
    }

    // Get an author by ID
    @GetMapping("/getbyid/{id}")
    public Author getAuthorById(@PathVariable("id") Long authorId) {
        return authorService.getAuthorById(authorId);
    }

    // Get all authors
    @GetMapping
    public List<Author> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    // Delete an author by ID
    @DeleteMapping("/delete/{id}")
    public void deleteAuthor(@PathVariable("id") Long authorId) {
        authorService.deleteAuthor(authorId);
    }
    
 // Fetch authors by user ID
    @GetMapping("/user/{userId}")
    public List<Author> getAuthorsByUserId(@PathVariable("userId") Long userId) {
        return authorService.getAuthorsByUserId(userId);
    }


}

