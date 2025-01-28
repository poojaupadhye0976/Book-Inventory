package com.LoginRegister.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.LoginRegister.example.entity.Genre;
import com.LoginRegister.example.entity.Users;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findByUser(Users user);
    Optional<Genre> findByGenreName(String genreName);
   
}
