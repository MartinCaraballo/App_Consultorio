package com.example.backend.services;

import com.example.backend.exceptions.UnauthorizedUserException;
import com.example.backend.models.Admin;
import com.example.backend.models.CustomUserDetails;
import com.example.backend.models.Login;
import com.example.backend.models.User;
import com.example.backend.repositories.AdminRepository;
import com.example.backend.repositories.LoginRepository;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final LoginRepository loginRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Login login = loginRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User %s not found", username)));

        if (!login.getAuthorized()) {
            throw new UnauthorizedUserException(username);
        }

        User user = userRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User %s not found", username)));

        Optional<Admin> dbAdmin = adminRepository.findById(username);
        return dbAdmin.map(admin -> new CustomUserDetails(user, login, admin))
                .orElseGet(() -> new CustomUserDetails(user, login, null));
    }
}
