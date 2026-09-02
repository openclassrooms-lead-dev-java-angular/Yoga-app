package com.openclassrooms.starterjwt.utils.factories;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

public class UserTestFactory {

    public static User createAdminUser() {
        User user = new User();
        user.setId(1L)
                .setEmail("admin@yoga.com")
                .setFirstName("Admin")
                .setLastName("Yoga")
                .setPassword("password")
                .setAdmin(true);

        return user;
    }

    public static User createUser() {
        User user = new User();
        user.setId(1L)
                .setEmail("admin@yoga.com")
                .setFirstName("Admin")
                .setLastName("Yoga")
                .setPassword("password")
                .setAdmin(false);

        return user;
    }
}
