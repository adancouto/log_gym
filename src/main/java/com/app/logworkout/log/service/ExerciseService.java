package com.app.logworkout.log.service;

import com.app.logworkout.log.domain.Exercise;
import com.app.logworkout.log.domain.Routine;
import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.ExerciseCreateDTO;
import com.app.logworkout.log.dto.ExerciseResponseDTO;
import com.app.logworkout.log.dto.ExerciseUpdateDTO;
import com.app.logworkout.log.exception.ForbiddenException;
import com.app.logworkout.log.exception.NotFoundException;
import com.app.logworkout.log.repository.ExerciseRepository;
import com.app.logworkout.log.repository.RoutineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepo;
    private final RoutineRepository routineRepo;

    public ExerciseService(ExerciseRepository exerciseRepo, RoutineRepository routineRepo) {
        this.exerciseRepo = exerciseRepo;
        this.routineRepo = routineRepo;
    }

    public ExerciseResponseDTO create(Long routineId, ExerciseCreateDTO dto, User user){
        Routine routine = getRoutineOwnedByUser(routineId, user);

        Exercise exercise = new Exercise();
        exercise.setName(dto.getName());
        exercise.setReps(dto.getReps());
        exercise.setWeight(dto.getWeight());
        exercise.setRoutine(routine);

        Exercise saved = exerciseRepo.save(exercise);

        return new ExerciseResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getWeight(),
                saved.getReps()
        );
    }

    public ExerciseResponseDTO update(
            Long routineId,
            Long exerciseId,
            ExerciseUpdateDTO dto,
            User user
    ) {
        Routine routine = getRoutineOwnedByUser(routineId, user);


        Exercise exercise = exerciseRepo.findById(exerciseId)
                .orElseThrow(() -> new NotFoundException("Exercício não encontrado"));

        if(!exercise.getRoutine().getId().equals(routineId)){
            throw new ForbiddenException("Exercício não pertence a rotina");

        }
        if (dto.getWeight() != null) {
            exercise.setWeight(dto.getWeight());
        }
        if (dto.getReps() != null) {
            exercise.setReps(dto.getReps());
        }

        Exercise saved = exerciseRepo.save(exercise);

        return new ExerciseResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getWeight(),
                saved.getReps()
        );


    }

    public List<ExerciseResponseDTO> findAllByRoutine(Long routineid, User user){
        Routine routine = getRoutineOwnedByUser(routineid, user);

        return exerciseRepo.findByRoutine(routine)
                .stream()
                .map(exercise -> new ExerciseResponseDTO(
                        exercise.getId(),
                        exercise.getName(),
                        exercise.getWeight(),
                        exercise.getReps()
                ))
                .toList();
    }

    private Routine getRoutineOwnedByUser(Long routineId, User user){
        Routine routine = routineRepo.findById(routineId)
                .orElseThrow(() -> new NotFoundException("Rotina não encontrada"));

        if (!routine.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Rotina não pertence ao usuário");
        }

        return routine;
    }


}
