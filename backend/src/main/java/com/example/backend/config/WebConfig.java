package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.zip.CheckedOutputStream;

@Configuration
@EnableWebMvc
@EnableMethodSecurity
public class WebConfig implements WebMvcConfigurer {
    @Value("${cors.origin.dns}")
    private String CORS_ORIGIN_DNS;

    @Value("${cors.origin.ip}")
    private String CORS_ORIGIN_IP;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://127.0.0.1:3000",
                        "http://localhost:3000",
                        "http://127.0.0.1:80",
                        "http://localhost:80",
                        "http://127.0.0.1",
                        "http://localhost",
                        CORS_ORIGIN_DNS,
                        CORS_ORIGIN_IP
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }
}