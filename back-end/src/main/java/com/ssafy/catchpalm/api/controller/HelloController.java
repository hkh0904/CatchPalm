package com.ssafy.catchpalm.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

@RestController
public class HelloController {
    @GetMapping("hello")
    public List<String> hello(){
        return Arrays.asList("Hello", "World!");
    }
}
