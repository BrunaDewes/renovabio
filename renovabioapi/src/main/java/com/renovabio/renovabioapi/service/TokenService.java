package com.renovabio.renovabioapi.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Value("${renovabio.jwt.secret:renovabio-dev-secret-change-me}")
    private String secret;

    @Value("${renovabio.jwt.expiration-hours:72}")
    private long expirationHours;

    public String gerarToken(Long usuarioId) {
        long expiresAt = Instant.now().plusSeconds(expirationHours * 3600).getEpochSecond();
        String payload = usuarioId + ":" + expiresAt;
        String encodedPayload = base64Url(payload.getBytes(StandardCharsets.UTF_8));
        String signature = assinar(encodedPayload);
        return encodedPayload + "." + signature;
    }

    public Long validarToken(String token) {
        if (token == null || !token.contains(".")) {
            return null;
        }

        String[] parts = token.split("\\.", 2);
        if (parts.length != 2 || !assinar(parts[0]).equals(parts[1])) {
            return null;
        }

        try {
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            String[] valores = payload.split(":", 2);
            Long usuarioId = Long.parseLong(valores[0]);
            long expiresAt = Long.parseLong(valores[1]);

            if (Instant.now().getEpochSecond() > expiresAt) {
                return null;
            }

            return usuarioId;
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private String assinar(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            return base64Url(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Nao foi possivel gerar token", exception);
        }
    }

    private String base64Url(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }
}
