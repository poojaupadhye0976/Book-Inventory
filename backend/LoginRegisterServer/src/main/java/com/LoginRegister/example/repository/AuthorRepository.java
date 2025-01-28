package com.LoginRegister.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.LoginRegister.example.entity.Author;
import com.LoginRegister.example.entity.Users;

import java.util.List;
import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    List<Author> findByUser(Users user);
    Optional<Author> findByauthorName(String name);
   

}
