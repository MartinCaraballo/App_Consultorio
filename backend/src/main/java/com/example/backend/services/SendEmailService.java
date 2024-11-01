package com.example.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendEmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public void sendSimpleMail(String message, String recipient) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(sender);
        mailMessage.setTo(recipient);
        mailMessage.setSubject("Reporte recibido!");
        mailMessage.setText(
                String.format("Su reporte: \"%s\",\nFue recibido con éxito. Nos contactaremos a la brevedad.", message)
        );

        mailSender.send(mailMessage);
    }

}
