package com.LoginRegister.example.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Secure key for HS256
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    // Generate a JWT token with userId (long)
    public String generateToken(long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))  // Convert userId to String as JWT only stores String subject
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)  // Use the securely generated key
                .compact();
    }

    // Validate a JWT token
    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)  // Use the securely generated key
                .build();
            parser.parseClaimsJws(token); // Parse the claims
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token is expired");
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("Token is malformed");
            return false;
        } catch (UnsupportedJwtException e) {
            System.out.println("Token is unsupported");
            return false;
        } catch (IllegalArgumentException e) {
            System.out.println("Token is illegal");
            return false;
        }
    }

    // Extract userId (subject) from the token
    public long extractUserId(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)  // Use the securely generated key
                    .build();
            // Extract the userId and convert it back to a long
            String userIdString = parser.parseClaimsJws(token)
                                        .getBody()
                                        .getSubject();
            return Long.parseLong(userIdString);  // Convert the extracted String back to long
        } catch (ExpiredJwtException e) {
            System.out.println("Token is expired, unable to extract userId");
        } catch (Exception e) {
            System.out.println("Error extracting userId from token: " + e.getMessage());
        }
        return -1;  // Return -1 if there is an error or token is invalid
    }
}
