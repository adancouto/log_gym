package com.app.logworkout.log.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key SECRET_KEY;

    private final long EXPIRATION_TIME;

    public JwtService(@Value("${jwt.secret}") String SECRET_KEY,
                      @Value("${jwt.expiration}") long EXPIRATION_TIME)
    {
        this.SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        this.EXPIRATION_TIME = EXPIRATION_TIME;
    }

    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSubject(String token){
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody();

        return claims.getSubject();
    }

}
