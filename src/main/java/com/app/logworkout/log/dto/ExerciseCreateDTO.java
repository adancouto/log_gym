package com.app.logworkout.log.dto;

import jakarta.validation.constraints.*;

public class ExerciseCreateDTO {
    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    @NotNull
    @PositiveOrZero
    private Double weight;

    @NotNull
    @Min(1)
    private Integer reps;

    public ExerciseCreateDTO(String name, double weight, int reps) {
        this.name = name;
        this.weight = weight;
        this.reps = reps;
    }

    public ExerciseCreateDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

}
