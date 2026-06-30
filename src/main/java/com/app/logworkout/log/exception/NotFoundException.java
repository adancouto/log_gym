package com.app.logworkout.log.exception;

import org.springframework.web.client.HttpClientErrorException;

public class NotFoundException extends RuntimeException{
    public NotFoundException(String message){
        super(message);
    }


}
