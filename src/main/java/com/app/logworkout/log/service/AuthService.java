package com.app.logworkout.log.service;

import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.AuthResponseDTO;
import com.app.logworkout.log.dto.UserLoginDTO;
import com.app.logworkout.log.dto.UserRegisterDTO;
import com.app.logworkout.log.dto.UserResponseDTO;
import com.app.logworkout.log.exception.BadRequestException;
import com.app.logworkout.log.exception.UnauthorizedException;
import com.app.logworkout.log.repository.UserRepository;
import com.app.logworkout.log.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwt) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponseDTO login(UserLoginDTO dto){
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Email ou senha inválidos"));

        if (!encoder.matches(dto.getPassword(), user.getPassword())){
            throw new UnauthorizedException("Email ou senha inválidos");
        }

        String token = jwt.generateToken(user.getEmail());

        return new AuthResponseDTO(token);
    }

    public UserResponseDTO register(UserRegisterDTO dto){

        if(userRepo.existsByEmail(dto.getEmail())){
            throw new BadRequestException("Email já cadastrado");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));

        userRepo.save(user);

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

    }


}
