package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final static String TAB_LIST = "LIST";
    private final static String TAB_ADD = "ADD";

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String index(Principal principal, Model model) {
        User authUser = (User) userService.loadUserByUsername(principal.getName());
        List<String> roles = authUser.getRoleNames();
        model.addAttribute("tab_visible", TAB_LIST);
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("roles", roles);
        model.addAttribute("active", "Admin");
        return "admin/index";
    }

    @GetMapping("/{id}")
    public String show(@PathVariable("id") Long id, Model model){
        model.addAttribute("user", userService.getUserById(id));
        return "user/details";
    }

    @GetMapping("/new")
    public String newUser(Principal principal, Model model){
        User authUser = (User) userService.loadUserByUsername(principal.getName());
        List<String> roles = authUser.getRoleNames();

        model.addAttribute("tab_visible", TAB_ADD);
        model.addAttribute("user", new User());
        model.addAttribute("roles", roles);
        model.addAttribute("active", "Admin");
        return "admin/index";
    }

    @PostMapping("/")
    public String create(@Valid User user, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return "fragments/form_new";
        }
        userService.save(user);
        return "redirect:/";
    }

    @GetMapping("/{id}/edit")
    public String edit(Model model, @PathVariable("id") Long id){
        model.addAttribute("user", userService.getUserById(id));
        return "fragments/form-edit";
    }

    @PatchMapping("/{id}")
    public String update(@PathVariable("id") Long id, @Valid User user, BindingResult bindingResult){
        boolean hasError = bindingResult.getFieldErrors().stream()
                .anyMatch(f -> !f.getField().equals("login") && !f.getField().equals("password"));
        if(hasError){
            return "admin/edit";
        }
        userService.update(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Long id){
        userService.delete(id);
        return "redirect:/admin";
    }

    private List<Role> getRoles(Principal principal) {
        if (principal == null) {
            return new ArrayList<>();
        }
        return ((UsernamePasswordAuthenticationToken) principal)
                .getAuthorities()
                .stream()
                .map(auth -> (Role) auth).collect(Collectors.toList());
    }
}
