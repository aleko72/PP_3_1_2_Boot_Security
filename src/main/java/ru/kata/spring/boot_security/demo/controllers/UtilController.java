package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

@RestController
@RequestMapping("/util")
public class UtilController {

    private final UserService userService;

    @Autowired
    public UtilController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/checkEmail")
    public Boolean checkEmail(long id, String email) {
        User userByEmail = userService.getUsers()
                .stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst().orElse(null);

        if (id != 0) {
            User userById = userService.getUserById(id);
            if (userByEmail != null && userById.getEmail().equals(userByEmail.getEmail())) {
                return true;
            }
        }
        return userByEmail == null;
    }
}
