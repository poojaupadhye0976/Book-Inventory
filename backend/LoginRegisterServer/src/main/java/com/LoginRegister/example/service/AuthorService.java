package com.LoginRegister.example.service;

import com.LoginRegister.example.entity.Author;
import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.AuthorRepository;
import com.LoginRegister.example.repository.UsersRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private UsersRepo userRepository;

    // Add a new author
    public Author addAuthor(Author author) {
        Users user = author.getUser();
        if (user.getUserId() == null) {
            user = userRepository.save(user);
        } else {
            user = userRepository.findById(user.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        }
        author.setUser(user);
        return authorRepository.save(author);
    }

    // Update an existing author
    public Author updateAuthor(Long authorId, Author updatedAuthor) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author with ID " + authorId + " not found."));
        author.setAuthorName(updatedAuthor.getAuthorName());
        author.setBiography(updatedAuthor.getBiography());
        author.setUpdatedAt(updatedAuthor.getUpdatedAt());
        return authorRepository.save(author);
    }

    // Get an author by ID
    public Author getAuthorById(Long authorId) {
        return authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author with ID " + authorId + " not found."));
    }

    // Get all authors
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    // Delete an author by ID
    public void deleteAuthor(Long authorId) {
        if (!authorRepository.existsById(authorId)) {
            throw new RuntimeException("Author with ID " + authorId + " not found.");
        }
        authorRepository.deleteById(authorId);
    }
    
    public List<Author> getAuthorsByUserId(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found."));
        return authorRepository.findByUser(user);
    }
    
 
}
