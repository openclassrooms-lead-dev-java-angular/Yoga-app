package com.openclassrooms.starterjwt.utils.factories;

import com.openclassrooms.starterjwt.enums.Role;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

public class UserDetailsImplTestFactory {

    public static UserDetailsImpl createUserDetails(User user, Role role) {
        return UserDetailsImpl.builder()
                .id(1L)
                .username(user.getEmail())
                .firstName(user.getFirstName())
                .password(user.getPassword())
                .lastName(user.getLastName())
                .admin(user.getAdmin())
                .role(role)
                .build();
    }
}
