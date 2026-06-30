package com.app.logworkout.log.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RoutineCreateDTO {

    @NotBlank
    @Size(min = 2, max = 50)
    private String name;


    public RoutineCreateDTO() {
    }

    public RoutineCreateDTO(String name) {
        this.name = name;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
