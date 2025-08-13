package com.str.Controllers;

import com.str.DTO.DocumentDTO;
import com.str.Models.Document;
import com.str.Services.DocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DocumentController {

    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload/{dossierId}")
public ResponseEntity<?> uploadDocumentWithPath(
        @PathVariable Long dossierId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "description", required = false) String description) {
    try {
        log.info("Tentative d'upload d'un document pour le dossier {}", dossierId);
        DocumentDTO response = documentService.uploadDocument(dossierId, file, description);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "document", response
        ));
    } catch (RuntimeException e) {
        log.error("Erreur d'upload: {}", e.getMessage());
        return ResponseEntity.status(422).body(Map.of(
            "success", false,
            "message", e.getMessage()
        ));
    } catch (Exception e) {
        log.error("Erreur lors de l'upload du document: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", e.getMessage()
        ));
    }
}

    @PostMapping("/upload")
public ResponseEntity<?> uploadDocument(
        @RequestParam("dossierId") Long dossierId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "description", required = false) String description) {
    try {
        log.info("Tentative d'upload d'un document pour le dossier {}", dossierId);
        DocumentDTO response = documentService.uploadDocument(dossierId, file, description);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "document", response
        ));
    } catch (Exception e) {
        log.error("Erreur lors de l'upload: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", e.getMessage()
        ));
    }
}

    @PostMapping("/dossier/{dossierId}")
    public ResponseEntity<DocumentDTO.Response> createDocument(
            @PathVariable Long dossierId,
            @RequestBody @Valid DocumentDTO.Create dto) {
        try {
            DocumentDTO.Response response = documentService.createDocument(dossierId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Erreur lors de la création du document: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<DocumentDTO.Response>> getDocumentsByDossier(@PathVariable Long dossierId) {
        try {
            List<DocumentDTO.Response> documents = documentService.getDocumentsByDossier(dossierId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des documents: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO.Response> getDocumentById(@PathVariable Long id) {
        try {
            DocumentDTO.Response document = documentService.getDocumentResponseById(id);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

   @GetMapping("/{id}/download")
public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
    try {
        Document document = documentService.getDocumentEntityById(id);
        byte[] content = document.getContenu();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                       "attachment; filename=\"" + document.getNomFichier() + "\"")
                .contentType(MediaType.parseMediaType(document.getTypeMime()))
                .contentLength(content.length)
                .body(content);
    } catch (Exception e) {
        log.error("Erreur lors du téléchargement: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}


@DeleteMapping("/{id}")
public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
    try {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Document supprimé avec succès"
        ));
    } catch (Exception e) {
        log.error("Erreur lors de la suppression: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", e.getMessage()
        ));
    }
}
@PutMapping("/{id}")
public ResponseEntity<?> updateDocument(@PathVariable Long id, @RequestBody DocumentDTO.Update dto) {
    try {
        DocumentDTO.Response updated = documentService.updateDocument(id, dto);
        return ResponseEntity.ok(updated);
    } catch (Exception e) {
        log.error("Erreur lors de la modification du document: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
}

    @GetMapping
    public ResponseEntity<List<DocumentDTO.Response>> getAllDocuments() {
        try {
            List<DocumentDTO.Response> documents = documentService.getAllDocuments();
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de tous les documents: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
