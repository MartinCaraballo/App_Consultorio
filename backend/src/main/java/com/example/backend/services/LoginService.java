package com.example.backend.services;

import com.example.backend.models.Login;
import com.example.backend.repositories.LoginRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final LoginRepository loginRepository;

    public List<Login> findAll() {
        return loginRepository.findAll();
    }

    public Optional<Login> findById(String email) {
        return loginRepository.findById(email);
    }

    public Login getPasswordByEmail(String email) { return loginRepository.getPasswordByEmail(email); }

    public void saveOrUpdate(Login login) {
        loginRepository.save(login);
    }

    public void delete(Login login) {
        loginRepository.delete(login);
    }
}
