package com.renovabio.renovabioapi.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.Locale;
import java.util.TreeMap;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    public String salvarImagem(MultipartFile file, String subdiretorio) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo de imagem e obrigatório");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie um arquivo de imagem válido");
        }

        validarConfiguracaoCloudinary();

        try {
            long timestamp = System.currentTimeMillis() / 1000;
            String publicId = UUID.randomUUID().toString();
            Map<String, String> params = new TreeMap<>();
            params.put("folder", "renovabio/" + subdiretorio);
            params.put("public_id", publicId);
            params.put("timestamp", String.valueOf(timestamp));

            String boundary = "RenovaBioBoundary" + UUID.randomUUID();
            byte[] body = montarMultipart(boundary, params, file, contentType);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload"))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível enviar a imagem para o Cloudinary");
            }

            String secureUrl = extrairCampoJson(response.body(), "secure_url");
            if (secureUrl == null || secureUrl.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Cloudinary não retornou a URL da imagem");
            }

            return secureUrl;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível salvar a imagem");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Envio da imagem foi interrompido");
        }
    }

    public void excluirImagem(String imagemUrl) {
        if (imagemUrl == null || imagemUrl.isBlank()) {
            return;
        }

        if (!imagemUrl.contains("res.cloudinary.com")) {
            return;
        }

        try {
            validarConfiguracaoCloudinary();
            String publicId = extrairPublicIdCloudinary(imagemUrl);
            if (publicId == null || publicId.isBlank()) {
                return;
            }

            long timestamp = System.currentTimeMillis() / 1000;
            Map<String, String> params = new TreeMap<>();
            params.put("public_id", publicId);
            params.put("timestamp", String.valueOf(timestamp));

            String body = "api_key=" + encode(apiKey)
                    + "&public_id=" + encode(publicId)
                    + "&timestamp=" + timestamp
                    + "&signature=" + assinar(params);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException ignored) {
            // A exclusao do registro no banco nao deve falhar se o arquivo ja nao existir.
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }
    }

    private void validarConfiguracaoCloudinary() {
        if (cloudName == null || cloudName.isBlank() || apiKey == null || apiKey.isBlank()
                || apiSecret == null || apiSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cloudinary não configurado na API");
        }
    }

    private byte[] montarMultipart(
            String boundary,
            Map<String, String> params,
            MultipartFile file,
            String contentType) throws IOException {

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            escreverCampo(output, boundary, entry.getKey(), entry.getValue());
        }
        escreverCampo(output, boundary, "api_key", apiKey);
        escreverCampo(output, boundary, "signature", assinar(params));
        escreverArquivo(output, boundary, file, contentType);
        output.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
        return output.toByteArray();
    }

    private void escreverCampo(ByteArrayOutputStream output, String boundary, String nome, String valor) throws IOException {
        output.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        output.write(("Content-Disposition: form-data; name=\"" + nome + "\"\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        output.write((valor + "\r\n").getBytes(StandardCharsets.UTF_8));
    }

    private void escreverArquivo(
            ByteArrayOutputStream output,
            String boundary,
            MultipartFile file,
            String contentType) throws IOException {

        String nomeArquivo = file.getOriginalFilename() != null ? file.getOriginalFilename() : "imagem.jpg";
        output.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        output.write(("Content-Disposition: form-data; name=\"file\"; filename=\"" + nomeArquivo + "\"\r\n")
                .getBytes(StandardCharsets.UTF_8));
        output.write(("Content-Type: " + contentType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        output.write(file.getBytes());
        output.write("\r\n".getBytes(StandardCharsets.UTF_8));
    }

    private String assinar(Map<String, String> params) {
        StringBuilder builder = new StringBuilder();
        boolean primeiro = true;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!primeiro) {
                builder.append("&");
            }
            builder.append(entry.getKey()).append("=").append(entry.getValue());
            primeiro = false;
        }
        builder.append(apiSecret);

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(builder.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte item : hash) {
                hex.append(String.format(Locale.ROOT, "%02x", item));
            }
            return hex.toString();
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível assinar requisição do Cloudinary", exception);
        }
    }

    private String extrairPublicIdCloudinary(String imagemUrl) {
        String path = URI.create(imagemUrl).getPath();
        String marcador = "/image/upload/";
        int inicio = path.indexOf(marcador);
        if (inicio < 0) {
            return null;
        }

        String publicId = path.substring(inicio + marcador.length());
        if (publicId.matches("v\\d+/.*")) {
            publicId = publicId.substring(publicId.indexOf("/") + 1);
        }

        int ultimoPonto = publicId.lastIndexOf(".");
        if (ultimoPonto > 0) {
            publicId = publicId.substring(0, ultimoPonto);
        }

        return publicId;
    }

    private String extrairCampoJson(String json, String campo) {
        String chave = "\"" + campo + "\":\"";
        int inicio = json.indexOf(chave);
        if (inicio < 0) {
            return null;
        }

        inicio += chave.length();
        StringBuilder valor = new StringBuilder();
        boolean escapado = false;
        for (int i = inicio; i < json.length(); i++) {
            char atual = json.charAt(i);
            if (escapado) {
                valor.append(atual);
                escapado = false;
                continue;
            }

            if (atual == '\\') {
                escapado = true;
                continue;
            }

            if (atual == '"') {
                return valor.toString();
            }

            valor.append(atual);
        }

        return null;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
