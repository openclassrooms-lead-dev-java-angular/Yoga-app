package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherMapper teacherMapper;
    private final TeacherService teacherService;


    @GetMapping("/{id}")
    public TeacherDto findById(
            @PathVariable("id") Long id
    ) {
        Teacher teacher = this.teacherService.findById(id);

        return  teacherMapper.toDto(teacher);
    }

    @GetMapping()
    public List<TeacherDto> findAll() {
        List<Teacher> teachers = this.teacherService.findAll();
        return this.teacherMapper.toDto(teachers);
    }
}
