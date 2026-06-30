package com.app.logworkout.log.dto;

public class RoutineResponseDTO {
    private Long id;
    private String name;

    public RoutineResponseDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
