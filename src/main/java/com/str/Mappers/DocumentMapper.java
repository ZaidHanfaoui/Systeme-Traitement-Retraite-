package com.str.Mappers;

import com.str.DTO.DocumentDTO;
import com.str.Models.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public DocumentDTO.Response toResponse(Document document) {
        if (document == null) {
            return null;
        }

        DocumentDTO.Response response = new DocumentDTO.Response();
        response.setId(document.getId());
        response.setNom(document.getNom());
        response.setNomFichier(document.getNomFichier());
        response.setType(document.getType());
        response.setTypeMime(document.getTypeMime());
        response.setDateUpload(document.getDateUpload());
        response.setDescription(document.getDescription());
        response.setDossierId(document.getDossier() != null ? document.getDossier().getId() : null);
        response.setTailleFichier(document.getTailleFichier());

        // Méthodes utilitaires pour déterminer le type de fichier
        response.setExtension(getFileExtension(document.getNomFichier()));
        response.setIsPdf(isPdfFile(document.getTypeMime()));
        response.setIsImage(isImageFile(document.getTypeMime()));
        response.setIsWord(isWordFile(document.getTypeMime()));

        return response;
    }

    public Document toEntity(DocumentDTO.Create dto) {
        if (dto == null) {
            return null;
        }

        Document document = new Document();
        document.setNom(dto.getNom());
        document.setNomFichier(dto.getNomFichier());
        document.setType(dto.getType());
        document.setTypeMime(dto.getTypeMime());
        document.setContenu(dto.getContenu());
        document.setDescription(dto.getDescription());
        // Note: tailleFichier sera calculé depuis le contenu ou défini dans le service
        if (dto.getContenu() != null) {
            document.setTailleFichier((long) dto.getContenu().length);
        }
        // Les autres champs (id, dossier, dateUpload) seront définis dans le service

        return document;
    }

    public DocumentDTO toDto(Document document) {
        if (document == null) {
            return null;
        }

        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setNom(document.getNom());
        dto.setNomFichier(document.getNomFichier());
        dto.setType(document.getType());
        dto.setTypeMime(document.getTypeMime());
        dto.setDateUpload(document.getDateUpload());
        dto.setDescription(document.getDescription());
        dto.setTailleFichier(document.getTailleFichier());
        dto.setDossierId(document.getDossier() != null ? document.getDossier().getId() : null);

        return dto;
    }

    // Méthodes utilitaires privées
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1).toLowerCase() : "";
    }

    private boolean isPdfFile(String mimeType) {
        return mimeType != null && mimeType.equals("application/pdf");
    }

    private boolean isImageFile(String mimeType) {
        return mimeType != null && mimeType.startsWith("image/");
    }

    private boolean isWordFile(String mimeType) {
        return mimeType != null && (
            mimeType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
            mimeType.equals("application/msword")
        );
    }
}
