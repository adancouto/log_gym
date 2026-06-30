package com.app.logworkout.log.service;

import com.app.logworkout.log.domain.Routine;
import com.app.logworkout.log.domain.User;
import com.app.logworkout.log.dto.RoutineCreateDTO;
import com.app.logworkout.log.dto.RoutineResponseDTO;
import com.app.logworkout.log.repository.RoutineRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RoutineService {

    private final RoutineRepository routineRepo;

    public RoutineService(RoutineRepository routineRepo) {
        this.routineRepo = routineRepo;
    }

    public RoutineResponseDTO create(RoutineCreateDTO dto, User user){
        Routine routine =  new Routine();
        routine.setName(dto.getName());
        routine.setUser(user);

        Routine saved = routineRepo.save(routine);

        return new RoutineResponseDTO(
                saved.getId(),
                saved.getName()
        );
    }

    public List<RoutineResponseDTO> findAllByUser(User user){
        return routineRepo.findByUser(user)
                .stream()
                .map(routine -> new RoutineResponseDTO(
                        routine.getId(),
                        routine.getName()
                )).toList();
    }

}
