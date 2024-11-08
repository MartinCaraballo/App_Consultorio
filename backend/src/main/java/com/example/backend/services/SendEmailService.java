package com.example.backend.services;

import com.example.backend.models.PasswordResetToken;
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

    public void sendErrorReportMail(String message, String recipient) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(sender);
        mailMessage.setTo(recipient);
        mailMessage.setSubject("Reporte recibido!");
        mailMessage.setText(
                String.format("Su reporte: \n\"%s\",\nFue recibido con éxito. Nos contactaremos a la brevedad.", message)
        );

        mailSender.send(mailMessage);
    }

    public void sendRecoverPasswordEmail(String recipient, PasswordResetToken passwordResetToken, String url) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(sender);
        mailMessage.setTo(recipient);
        mailMessage.setSubject("Solicitud de reseteo de contraseña");
        mailMessage.setText(
                String.format(
                        "Si usted requirió un cambio de contraseña, " +
                        "ingrese en el siguiente link y escriba su nueva contraseña: %s" +
                        "\nEl link expira en 24 horas." +
                        "\nSi no requirió un cambio de contraseña, ignore el mensaje.",
                        url
                )
        );

        mailSender.send(mailMessage);
    }

}
