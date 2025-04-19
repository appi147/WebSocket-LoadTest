package com.appi.ws.controller;

import com.appi.ws.model.SampleRequest;
import com.appi.ws.model.SampleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class MessageController {

    @MessageMapping("/request")
    @SendTo("/topic/response")
    public SampleResponse handle(SampleRequest request) {

        return new SampleResponse(request);
    }

}
