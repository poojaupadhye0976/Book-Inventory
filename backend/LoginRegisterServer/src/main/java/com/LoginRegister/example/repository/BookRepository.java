package com.LoginRegister.example.repository;

import com.LoginRegister.example.entity.Book;
import com.LoginRegister.example.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUser(Users user);
    

}
