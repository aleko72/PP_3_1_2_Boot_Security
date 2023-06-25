package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getUsers();
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable long id) {
        return userService.getUserById(id);
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

    @PostMapping("/")
    public String create(@Valid User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder error = new StringBuilder("Failed to create user:");
            error.append("#");
            for (FieldError e : bindingResult.getFieldErrors()) {
                error.append(e.getDefaultMessage()).append("#");
            }
            return error.toString();
        }
        userService.save(user);
        return null;
    }

    @PatchMapping("/{id}")
    public String update(@PathVariable("id") Long id, @Valid User user, BindingResult bindingResult) {
        List<FieldError> errors = bindingResult.getFieldErrors().stream()
                .filter(f -> !f.getField().equals("password")).collect(Collectors.toList());
        if (errors.size() > 0) {
            StringBuilder error = new StringBuilder("Failed to update user:");
            error.append("#");
            for (FieldError e : errors) {
                error.append(e.getDefaultMessage()).append("#");
            }
            return error.toString();
        }
        userService.update(id, user);
        return null;
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return null;
    }
}
