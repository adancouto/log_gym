package com.app.logworkout.log.repository;

import com.app.logworkout.log.domain.Exercise;
import com.app.logworkout.log.domain.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByRoutine(Routine routine);


}
