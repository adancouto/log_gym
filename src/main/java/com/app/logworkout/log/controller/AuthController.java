package com.app.logworkout.log.controller;


import com.app.logworkout.log.dto.*;
import com.app.logworkout.log.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService serv;

    public AuthController(AuthService serv) {
        this.serv = serv;
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody UserLoginDTO dto) {
        return serv.login(dto);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO register(@Valid @RequestBody UserRegisterDTO dto){
        return serv.register(dto);

    }

}

