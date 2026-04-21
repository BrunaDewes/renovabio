package com.renovabio.renovabioapi.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

    private final Path uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();

    public String salvarImagem(MultipartFile file, String subdiretorio) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo de imagem e obrigatorio");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie um arquivo de imagem valido");
        }

        try {
            Path diretorio = uploadRoot.resolve(subdiretorio).normalize();
            Files.createDirectories(diretorio);

            String extensao = obterExtensao(file.getOriginalFilename(), contentType);
            String nomeArquivo = UUID.randomUUID() + extensao;
            Path destino = diretorio.resolve(nomeArquivo).normalize();

            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + subdiretorio + "/" + nomeArquivo;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Nao foi possivel salvar a imagem");
        }
    }

    private String obterExtensao(String nomeOriginal, String contentType) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf(".")).toLowerCase(Locale.ROOT);
            if (extensao.matches("\\.(jpg|jpeg|png|webp)")) {
                return extensao;
            }
        }

        if ("image/png".equalsIgnoreCase(contentType)) {
            return ".png";
        }

        if ("image/webp".equalsIgnoreCase(contentType)) {
            return ".webp";
        }

        return ".jpg";
    }
}
