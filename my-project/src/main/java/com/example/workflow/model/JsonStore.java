package com.example.workflow.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Stream;

@Component
public class JsonStore {
    private final ObjectMapper objectMapper;

    public JsonStore() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public void save(Map<String, Object> data, String name ,String dir) {
        try {
            Path folderPath = Paths.get(dir);

            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            String fileName = name  + ".json";

            File outputFile = folderPath
                    .resolve(fileName)
                    .toFile();

            objectMapper.writeValue(outputFile, data);

        } catch (IOException e) {
            throw new RuntimeException("Error guardando JSON", e);
        }
    }

    private Path getStorageFolderPath(String name) {
        return Paths.get(name);
    }

    public Map<String, Object> getLatest(String dir) {
        Path folderPath = getStorageFolderPath(dir);

        if (!Files.exists(folderPath)) {
            throw new RuntimeException("La carpeta '" + folderPath + "' no existe todavía");
        }

        try (Stream<Path> files = Files.list(folderPath)) {
            Path latestFile = files
                    .filter(p -> p.toString().endsWith(".json"))
                    // ← sin filtro por nombre, toma todos los JSON de la carpeta
                    .max(Comparator.comparing(p -> {
                        try {
                            return Files.getLastModifiedTime(p);
                        } catch (IOException e) {
                            return FileTime.fromMillis(0);
                        }
                    }))
                    .orElseThrow(() -> new RuntimeException("No hay archivos JSON en la carpeta: " + folderPath));

            @SuppressWarnings("unchecked")
            Map<String, Object> data = objectMapper.readValue(latestFile.toFile(), Map.class);
            return data;

        } catch (IOException e) {
            throw new RuntimeException("Error leyendo el último JSON", e);
        }
    }

    public void updateLatest(String dir, Map<String, Object> data) {
        save(data, dir, dir);
    }

    public List<Map<String, Object>> getAll(String dir) {
        Path folderPath = Paths.get(dir);

        if (!Files.exists(folderPath)) {
            return Collections.emptyList();
        }

        try (Stream<Path> files = Files.list(folderPath)) {
            List<Map<String, Object>> allData = new ArrayList<>();

            List<Path> sortedFiles = files
                    .filter(p -> p.toString().endsWith(".json"))
                    .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                    .toList();

            for (Path file : sortedFiles) {
                @SuppressWarnings("unchecked")
                Map<String, Object> entry = objectMapper.readValue(file.toFile(), Map.class);
                allData.add(entry);
            }

            return allData;

        } catch (IOException e) {
            throw new RuntimeException("Error leyendo todos los JSON", e);
        }
    }

    public Map<String, Object> getByFileName(String dir,String fileName) {
        Path filePath = Paths.get(dir, fileName);

        if (!Files.exists(filePath)) {
            throw new RuntimeException("Archivo no encontrado: " + fileName);
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> data = objectMapper.readValue(filePath.toFile(), Map.class);
            return data;

        } catch (IOException e) {
            throw new RuntimeException("Error leyendo archivo: " + fileName, e);
        }
    }
}