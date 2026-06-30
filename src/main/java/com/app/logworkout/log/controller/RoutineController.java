package com.app.logworkout.log.controller;


import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.RoutineCreateDTO;
import com.app.logworkout.log.dto.RoutineResponseDTO;
import com.app.logworkout.log.service.RoutineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routines")
public class RoutineController {

    private final RoutineService serv;

    public RoutineController(RoutineService serv) {
        this.serv = serv;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoutineResponseDTO create(@Valid @RequestBody RoutineCreateDTO dto
            ,@AuthenticationPrincipal User user){
        return serv.create(dto, user);

    }

    @GetMapping
    public List<RoutineResponseDTO> findAll(@AuthenticationPrincipal User user){
        return serv.findAllByUser(user);


    }

}
