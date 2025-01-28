package com.LoginRegister.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LoginRegister.example.entity.Genre;
import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.GenreRepository;
import com.LoginRegister.example.repository.UsersRepo;

@Service
public class GenreService {

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private UsersRepo userRepository;

    public Genre addGenre(Genre genre) {
        Users user = userRepository.findById(genre.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        genre.setUser(user);
        return genreRepository.save(genre);
    }

    public Genre updateGenre(Long genreId, Genre updatedGenre) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new RuntimeException("Genre with ID " + genreId + " not found."));
        genre.setGenreName(updatedGenre.getGenreName());
        genre.setDescription(updatedGenre.getDescription());
        return genreRepository.save(genre);
    }

    public Genre getGenreById(Long genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new RuntimeException("Genre with ID " + genreId + " not found."));
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public void deleteGenre(Long genreId) {
        if (!genreRepository.existsById(genreId)) {
            throw new RuntimeException("Genre with ID " + genreId + " not found.");
        }
        genreRepository.deleteById(genreId);
    }

    public List<Genre> getGenresByUserId(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found."));
        return genreRepository.findByUser(user);
    }
  
}
