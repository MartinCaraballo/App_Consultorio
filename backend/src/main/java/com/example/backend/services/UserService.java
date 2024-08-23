package com.example.backend.services;

import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findById(String email) {
        return userRepository.findById(email);
    }

    public List<User> findNotAuthorized() {
        return userRepository.findNotAuthorizedUsers();
    }

    public void saveOrUpdate(User user) {
        userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }
}
