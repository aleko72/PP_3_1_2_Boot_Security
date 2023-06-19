package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/admin")
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
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("roles", roles);
        model.addAttribute("active", "Admin");
        return "admin/index";
    }

    @PostMapping("/")
    public String create(@Valid User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "fragments/form_new";
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String update(@PathVariable("id") Long id, @Valid User user, BindingResult bindingResult) {
        boolean hasError = bindingResult.getFieldErrors().stream()
                .anyMatch(f -> !f.getField().equals("login") && !f.getField().equals("password"));
        if (hasError) {
            return "admin/edit";
        }
        userService.update(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
