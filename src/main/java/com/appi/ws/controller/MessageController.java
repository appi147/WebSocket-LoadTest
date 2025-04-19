package com.appi.ws.controller;

import com.appi.ws.model.SampleRequest;
import com.appi.ws.model.SampleResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/request")
    @SendTo("/topic/response")
    public SampleResponse handle(SampleRequest request) {
        return new SampleResponse(request);
    }

}
