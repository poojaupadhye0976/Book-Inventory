package com.LoginRegister.example.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.LoginRegister.example.entity.Users;
import com.LoginRegister.example.repository.UsersRepo;
import com.LoginRegister.example.requests.LoginRequest;
import com.LoginRegister.example.responses.LoginResponse;
import com.LoginRegister.example.util.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Users addUser(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encrypting the password
        return usersRepo.save(user);
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {
        Optional<Users> user = usersRepo.findByEmail(loginRequest.getEmail());
        if (user.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        Users user1 = user.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user1.getPassword())) { // Verifying password
            throw new RuntimeException("Invalid email or password");
        }

        // Generate the JWT token
        String token = jwtUtil.generateToken(user1.getUserId());

        // Return the token wrapped in a JSON response object
        return new LoginResponse(token);
    }
    public Optional<Users> findById(Long userId) {
        return usersRepo.findById(userId);
    }
}
