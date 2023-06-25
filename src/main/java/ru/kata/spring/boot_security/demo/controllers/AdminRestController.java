package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/adminRest")
public class AdminRestController {

    private final UserService userService;

    @Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getUsers();
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable long id){
        return userService.getUserById(id);
    }

    @PostMapping("/")
    public String create(@Valid User user, BindingResult bindingResult ) {
        if (bindingResult.hasErrors()) {
            StringBuilder error = new StringBuilder("Failed to create user:");
            error.append("#");
            for (FieldError e : bindingResult.getFieldErrors()) {
                error.append(e.getDefaultMessage()).append("#");
            }
            return error.toString();
        }
        userService.save(user);
        return "error";
    }
}
