package com.example.backend.config;

import com.example.backend.models.*;
import com.example.backend.repositories.AdminRepository;
import com.example.backend.repositories.LoginRepository;
import com.example.backend.repositories.PriceRepository;
import com.example.backend.repositories.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    @Value("${default.user.email}")
    private String DEFAULT_EMAIL;

    @Value("${default.user.name}")
    private String DEFAULT_NAME;

    @Value("${default.user.last-name}")
    private String DEFAULT_LAST_NAME;

    @Value("${default.user.phone-number}")
    private String DEFAULT_PHONE_NUMBER;

    @Value("${default.user.password}")
    private String DEFAULT_PASSWORD;


    private final LoginRepository loginRepository;
    private final AdminRepository adminRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    private final PriceRepository priceRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (loginRepository.existsById(DEFAULT_EMAIL)) {
            return;
        }

        // Load default admin user.
        User user = getDefaultUser();
        Login login = getDefaultLogin();
        Admin admin = new Admin();
        login.setUser(user);
        admin.setUser(user);

        loginRepository.save(login);
        adminRepository.save(admin);

        for (int i = 1; i < 5; i++) {
            Room room = new Room();
            room.setRoomId(i);

            roomRepository.save(room);
        }

        Price price1 = new Price();
        price1.setHours(10);
        price1.setPricePerHour(200);
        priceRepository.save(price1);

        Price price2 = new Price();
        price2.setHours(20);
        price2.setPricePerHour(180);
        priceRepository.save(price2);

        Price price3 = new Price();
        price3.setHours(144);
        price3.setPricePerHour(160);
        priceRepository.save(price3);
    }

    private User getDefaultUser() {
        User user = new User();
        user.setName(DEFAULT_NAME);
        user.setLastName(DEFAULT_LAST_NAME);
        user.setPhoneNumber(DEFAULT_PHONE_NUMBER);
        user.setEmail(DEFAULT_EMAIL);

        return user;
    }

    private Login getDefaultLogin() {
        Login login = new Login();
        login.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        login.setAuthorized(true);
        login.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));

        return login;
    }
}
