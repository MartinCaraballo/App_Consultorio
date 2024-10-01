package com.example.backend.repositories;

import com.example.backend.models.Admin;
import com.example.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminRepository extends JpaRepository<Admin, String> {

    @Query("SELECT u FROM Admin a JOIN User u ON a.email = u.email")
    List<User> findAllAdminUsers();
}
