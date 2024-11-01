package com.example.backend.repositories;

import com.example.backend.models.Login;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<Login, String> {

    Login getPasswordByEmail(String email);
}
