package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.utils.factories.TeacherTestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;
    private TeacherDto teacherDto;
    private List<Teacher> teachers;
    private List<TeacherDto> teacherDtos;

    @BeforeEach
    void setUp() {
        teacher = TeacherTestFactory.createTeacher();
        teacherDto = TeacherTestFactory.createTeacherDto();
        teachers = TeacherTestFactory.createTeachers();
        teacherDtos = TeacherTestFactory.createTeacherDtos();
    }

    /**
     *  findAll()
     */

    @Test
    public void shouldReturnAllTeachers() {
        when(teacherRepository.findAll())
                .thenReturn(teachers);
        when(teacherMapper.toDto(teachers))
                .thenReturn(teacherDtos);

        List<TeacherDto> result = teacherService.findAll();

        assertThat(result.size()).isEqualTo(2);
        assertThat(result).isEqualTo(teacherDtos);

        verify(teacherRepository).findAll();
        verify(teacherMapper).toDto(teachers);
    }

    @Test
    public void shouldReturnEmptyListWhenNoTeachersExist() {
        when(teacherRepository.findAll())
                .thenReturn(Collections.emptyList());

        List<TeacherDto> result = teacherService.findAll();

        assertThat(result.size()).isEqualTo(0);

        verify(teacherRepository).findAll();
        verify(teacherMapper).toDto(Collections.emptyList());
    }

    /**
     *  findTeacherById(Long id)
     */

    @Test
    public void shouldReturnTeacherDtoWhenTeacherExists() {
        when(teacherRepository.findById(teacher.getId()))
                .thenReturn(Optional.of(teacher));
        when(teacherMapper.toDto(teacher))
                .thenReturn(teacherDto);

        TeacherDto result = teacherService.findTeacherById(1L);

        assertThat(result).isEqualTo(teacherDto);

        verify(teacherMapper)
                .toDto(teacher);
        verify(teacherMapper)
                .toDto(teacher);
        verify(teacherRepository).findById(1L);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenTeacherDoesNotExist() {
        when(teacherRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> teacherService.findTeacherById(1L))
                .isInstanceOf(NotFoundException.class);

        verify(teacherRepository).findById(1L);
        verify(teacherMapper, never())
                .toDto(teacher);
    }

    /**
     *  findById(Long id)
     */

    @Test
    public void shouldReturnTeacherWhenTeacherExists() {
        when(teacherRepository.findById(teacher.getId()))
                .thenReturn(Optional.of(teacher));
        when(teacherMapper.toDto(teacher))
                .thenReturn(teacherDto);

        TeacherDto result = teacherService.findTeacherById(1L);

        assertThat(result).isEqualTo(teacherDto);

        verify(teacherMapper).toDto(teacher);
        verify(teacherRepository).findById(1L);
    }

    @Test
    public void shouldThrowNotFoundExceptionWhenWantedTeacherNotExists() {
        when(teacherRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> teacherService.findTeacherById(1L))
                .isInstanceOf(NotFoundException.class);

        verify(teacherRepository).findById(1L);
        verify(teacherMapper, never()).toDto(teacher);
    }
}
