package com.appi.ws.model;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class SampleResponse {

    private final String value;

    public SampleResponse(SampleRequest sampleRequest) {
        this.value = String.format("Request '%s' scheduled for %s", sampleRequest.getValue(), LocalDateTime.now()
                .plusHours(2).format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss")));
    }
}
