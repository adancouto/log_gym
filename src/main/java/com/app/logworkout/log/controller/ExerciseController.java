package com.app.logworkout.log.controller;


import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.ExerciseCreateDTO;
import com.app.logworkout.log.dto.ExerciseResponseDTO;
import com.app.logworkout.log.dto.ExerciseUpdateDTO;
import com.app.logworkout.log.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routines/{routineId}/exercises")
public class ExerciseController {

    private final ExerciseService serv;

    public ExerciseController(ExerciseService serv) {
        this.serv = serv;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExerciseResponseDTO create(
            @PathVariable Long routineId,
            @Valid @RequestBody ExerciseCreateDTO dto,
            @AuthenticationPrincipal User user
    ) {
        return serv.create(routineId, dto, user);
    }

    @PutMapping("/{exerciseId}")
    public ExerciseResponseDTO update(
            @PathVariable Long routineId,
            @PathVariable Long exerciseId,
            @Valid @RequestBody ExerciseUpdateDTO dto,
            @AuthenticationPrincipal User user
    ) {
        return serv.update(routineId, exerciseId, dto, user);
    }

    @GetMapping
    public List<ExerciseResponseDTO> list(
            @PathVariable Long routineId,
            @AuthenticationPrincipal User user
    ) {
        return serv.findAllByRoutine(routineId, user);
    }



}
