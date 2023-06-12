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

@Controller
//@RequestMapping("/admin")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String index(@ModelAttribute User user, Principal principal, Model model){
        List<User> users = new ArrayList<>();
        if (principal != null) {
            if (isAdmin(principal)) {
                users.addAll(userService.getUsers());
            } else {
                users.add((User) userService.loadUserByUsername(principal.getName()));
            }
        }else{
            return "redirect:/login";
        }

        model.addAttribute("users", users);
        return "index";
    }



    @GetMapping("/{id}")
    public String show(@PathVariable("id") Long id, Model model){
        model.addAttribute("user", userService.getUserById(id));
        return "user/details";
    }

    @GetMapping("/new")
    public String newUser(@ModelAttribute User user){
        return "admin/new";
    }

    @GetMapping("/ajax")
    public String test(@ModelAttribute User user){
        return "admin/new";
    }

    @PostMapping()
    public String create(@Valid User user, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return "admin/new";
        }
        userService.save(user);
        return "redirect:/";
    }

    @GetMapping("/{id}/edit")
    public String edit(Model model, @PathVariable("id") Long id){
        model.addAttribute("user", userService.getUserById(id));
        return "edit";
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

    private boolean isAdmin(Principal principal) {
        if (principal == null) return false;
        return ((UsernamePasswordAuthenticationToken) principal)
                .getAuthorities()
                .stream()
                .anyMatch(auth -> ((Role) auth).getName().equals("ROLE_ADMIN"));
    }
}
