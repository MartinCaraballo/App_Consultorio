package com.example.backend.services;

import com.example.backend.models.Admin;
import com.example.backend.models.User;
import com.example.backend.repositories.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public List<User> findAllAdminUsers() { return adminRepository.findAllAdminUsers(); }

    public Optional<Admin> findById(String email) {
        return adminRepository.findById(email);
    }

    public void saveOrUpdate(Admin admin) {
        adminRepository.save(admin);
    }

    public void delete(Admin admin) {
        adminRepository.delete(admin);
    }
}
