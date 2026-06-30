package com.app.logworkout.log.repository;

import com.app.logworkout.log.domain.Routine;
import com.app.logworkout.log.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {

    List<Routine> findByUser(User user);


}
