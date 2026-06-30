package com.app.logworkout.log.controller;

import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.UserResponseDTO;
import com.app.logworkout.log.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService serv;

    public UserController(UserService serv) {
        this.serv = serv;
    }

    @GetMapping("/me")
    public UserResponseDTO me(@AuthenticationPrincipal User user){
        return serv.getMe(user);

    }


}
