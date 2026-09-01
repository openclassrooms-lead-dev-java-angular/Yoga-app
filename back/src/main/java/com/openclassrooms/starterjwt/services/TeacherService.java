package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    @Transactional(readOnly = true)
    public List<TeacherDto> findAll() {
        List<Teacher> teachers = teacherRepository.findAll();

        return teacherMapper.toDto(teachers);
    }

    @Transactional(readOnly = true)
    public TeacherDto findTeacherById(Long id) {
        Teacher teacher =  this.teacherRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);

        return teacherMapper.toDto(teacher);
    }

    @Transactional(readOnly = true)
    public Teacher findById(Long id) {
        return  this.teacherRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);
    }
}
