package com.str.Services;

import com.str.DTO.DocumentDTO;
import com.str.Mappers.DocumentMapper;
import com.str.Models.Document;
import com.str.Models.DossierRetraite;
import com.str.Repositories.DocumentRepository;
import com.str.Repositories.DossierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final DossierRepository dossierRepository;
    private final DocumentMapper documentMapper;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.max-file-size:10485760}")
    private long maxFileSize;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public DocumentService(DocumentRepository documentRepository,
                          DossierRepository dossierRepository,
                          DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.dossierRepository = dossierRepository;
        this.documentMapper = documentMapper;
    }

    public DocumentDTO uploadDocument(Long dossierId, MultipartFile file, String description) throws IOException {
        log.info("Début de l'upload du document pour le dossier {}", dossierId);

        // Vérifier que le dossier existe
        DossierRetraite dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> {
                    log.error("Dossier non trouvé avec l'ID {}", dossierId);
                    return new EntityNotFoundException("Dossier non trouvé avec l'ID: " + dossierId);
                });

        // Validation du fichier
        validateFile(file);

        // Créer le répertoire de stockage s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Créer l'entité Document
        Document document = new Document();
        document.setNom(originalFilename);
        document.setType(file.getContentType());
        document.setTypeMime(file.getContentType()); // Correction ici
        document.setTailleFichier(file.getSize());
        document.setNomFichier(filePath.toString());
        document.setDateUpload(LocalDateTime.now());
        document.setDescription(description);
        document.setDossier(dossier);

        Document savedDocument = documentRepository.save(document);
        log.info("Document sauvegardé avec l'ID {}", savedDocument.getId());

        return documentMapper.toDto(savedDocument);
    }

    public DocumentDTO.Response createDocument(Long dossierId, DocumentDTO.Create dto) {
        DossierRetraite dossier = dossierRepository.findById(dossierId)
            .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé avec l'ID: " + dossierId));
        Document document = documentMapper.toEntity(dto); // Conversion correcte du DTO en entité
        document.setDossier(dossier);
        document.setDateUpload(LocalDateTime.now());
        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public DocumentDTO.Response getDocumentResponseById(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Document non trouvé avec l'ID: " + id));
        return documentMapper.toResponse(document);
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO.Response> getAllDocuments() {
        return documentRepository.findAll().stream()
            .map(documentMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO.Response> getDocumentsByDossier(Long dossierId) {
        if (!dossierRepository.existsById(dossierId)) {
            throw new EntityNotFoundException("Dossier non trouvé avec l'ID: " + dossierId);
        }
        return documentRepository.findByDossierRetraiteId(dossierId)
            .stream()
            .map(documentMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public DocumentDTO getDocumentById(Long id) {
        return documentRepository.findById(id)
                .map(documentMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Document non trouvé avec l'ID: " + id));
    }

    public Resource downloadDocument(Long documentId) throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document non trouvé avec l'ID: " + documentId));

        Path filePath = Paths.get(document.getNomFichier());
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new IOException("Fichier non trouvé ou non lisible: " + document.getNomFichier());
        }
    }

    public void deleteDocument(Long id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document non trouvé avec l'ID: " + id));

        // Supprimer le fichier physique
        try {
            Path filePath = Paths.get(document.getNomFichier());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Impossible de supprimer le fichier physique: {}", document.getNomFichier(), e);
        }

        // Supprimer l'enregistrement en base
        documentRepository.delete(document);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier ne peut pas être vide");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Le fichier est trop volumineux. Taille maximale autorisée: " + maxFileSize + " bytes");
        }
        // Désactivation de la vérification du type MIME pour autoriser tous les types de fichiers
        // String contentType = file.getContentType();
        // if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
        //     throw new IllegalArgumentException("Type de fichier non autorisé: " + contentType);
        // }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private boolean isValidFileType(String contentType) {
        return ALLOWED_CONTENT_TYPES.contains(contentType);
    }

    public Document getDocumentEntityById(Long id) {
        return documentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Document non trouvé avec l'ID: " + id));
    }
}
