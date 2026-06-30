package com.app.logworkout.log.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public class ExerciseUpdateDTO {
    @PositiveOrZero
    private Double weight;
    @Min(1)
    private Integer reps;

    public ExerciseUpdateDTO() {
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getWeight() {
        return weight;
    }

    public Integer getReps() {
        return reps;
    }
}
