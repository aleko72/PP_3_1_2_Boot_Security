package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> getUsers();

    User getUserById(long id);
    void save(User user);
    void update(long id, User user);
    void delete(long id);
}
