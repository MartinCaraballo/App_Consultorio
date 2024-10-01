package com.example.backend.repositories;

import com.example.backend.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT u FROM User u JOIN Login l ON u.email = l.email WHERE NOT l.authorized")
    List<User> findNotAuthorizedUsers();

    @Query("SELECT u FROM User u LEFT JOIN Admin a ON u.email = a.email WHERE a.email IS NULL")
    List<User> findAllRegularUsers();
}
