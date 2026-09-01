package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.services.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;


    @GetMapping("/{id}")
    public TeacherDto findById(
            @PathVariable("id") Long id
    ) {
        return this.teacherService.findTeacherById(id);
    }

    @GetMapping("")
    public List<TeacherDto> findAll() {
        return this.teacherService.findAll();
    }
}
