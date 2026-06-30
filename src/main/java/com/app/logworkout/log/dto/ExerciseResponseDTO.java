package com.app.logworkout.log.dto;

public class ExerciseResponseDTO {
    private Long id;
    private String name;
    private Double weight;
    private Integer reps;

    public ExerciseResponseDTO(Long id, String name, Double weight, Integer reps) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.reps = reps;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getWeight() {
        return weight;
    }

    public Integer getReps() {
        return reps;
    }
}
