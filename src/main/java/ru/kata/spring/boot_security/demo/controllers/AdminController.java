package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

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
    public String create(@Valid User user, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            StringBuilder error = new StringBuilder("Failed to create user:");
            error.append("#");
            for (FieldError e : bindingResult.getFieldErrors()) {
                error.append(e.getDefaultMessage()).append("#");
            }
            redirectAttributes.addFlashAttribute("error", error.toString());
            return "redirect:/admin";
        }
        userService.save(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String update(@PathVariable("id") Long id, @Valid User user, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        List<FieldError> errors = bindingResult.getFieldErrors().stream()
                .filter(f -> !f.getField().equals("password")).collect(Collectors.toList());
        if (errors.size() > 0) {
            StringBuilder error = new StringBuilder("Failed to update user:");
            error.append("#");
            for (FieldError e : errors) {
                error.append(e.getDefaultMessage()).append("#");
            }
            redirectAttributes.addFlashAttribute("error", error.toString());
            return "redirect:/admin";
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
