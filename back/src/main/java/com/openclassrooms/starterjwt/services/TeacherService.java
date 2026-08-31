package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
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

    @Transactional(readOnly = true)
    public List<Teacher> findAll() {
        return this.teacherRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Teacher findById(Long id) {
        return this.teacherRepository
                .findById(id)
                .orElseThrow(NotFoundException::new);
    }
}
