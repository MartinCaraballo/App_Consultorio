package com.example.backend.services;

import com.example.backend.exceptions.UnauthorizedUserException;
import com.example.backend.models.Admin;
import com.example.backend.models.CustomUserDetails;
import com.example.backend.models.Login;
import com.example.backend.repositories.AdminRepository;
import com.example.backend.repositories.LoginRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Internal;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final LoginRepository loginRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws BadCredentialsException, InternalAuthenticationServiceException {
        Login login = loginRepository.findById(username)
                .orElseThrow(() -> new UnauthorizedUserException("Email or password are incorrect"));

        if (!login.getAuthorized()) {
            throw new InternalAuthenticationServiceException("User not authorized yet");
        }

        CustomUserDetails customUserDetails = new CustomUserDetails();
        customUserDetails.setEmail(login.getEmail());
        customUserDetails.setPassword(login.getPassword());
        customUserDetails.setName(login.getUser().getName());
        customUserDetails.setLastName(login.getUser().getLastName());

        Optional<Admin> dbAdmin = adminRepository.findById(username);
        if (dbAdmin.isPresent()) {
            customUserDetails.setAdmin(true);
            return customUserDetails;
        }
        customUserDetails.setAdmin(false);
        return customUserDetails;
    }
}
