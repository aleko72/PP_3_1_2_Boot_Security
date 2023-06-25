package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {

        this.userService = userService;
    }

    @GetMapping()
    public String index(Principal principal, Model model) {
        User authUser = (User) userService.loadUserByUsername(principal.getName());
        List<String> roles = authUser.getRoleNames();

        model.addAttribute("id", authUser.getId());
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("roles", roles);
        return "admin/index";
    }
}
