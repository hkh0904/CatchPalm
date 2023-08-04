package com.ssafy.catchpalm.api.controller;

import com.ssafy.catchpalm.api.service.LocalStorageServiceImpl;
import com.ssafy.catchpalm.api.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController {

    @Autowired
    private final StorageService storageService;

    public GameController(LocalStorageServiceImpl storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.load(filename);
        return ResponseEntity.ok().body(file);
    }
}