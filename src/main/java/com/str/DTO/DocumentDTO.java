package com.str.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Long id;
    private String nom;
    private String nomFichier;
    private String type;
    private String typeMime;
    private LocalDateTime dateUpload;
    private String description;
    private Long tailleFichier;
    private Long dossierId;

    // Getters/Setters explicites pour DocumentDTO principal
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTypeMime() { return typeMime; }
    public void setTypeMime(String typeMime) { this.typeMime = typeMime; }

    public LocalDateTime getDateUpload() { return dateUpload; }
    public void setDateUpload(LocalDateTime dateUpload) { this.dateUpload = dateUpload; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getTailleFichier() { return tailleFichier; }
    public void setTailleFichier(Long tailleFichier) { this.tailleFichier = tailleFichier; }

    public Long getDossierId() { return dossierId; }
    public void setDossierId(Long dossierId) { this.dossierId = dossierId; }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        @NotBlank(message = "Le nom du fichier est obligatoire")
        private String nom;

        @NotBlank(message = "Le nom du fichier est obligatoire")
        private String nomFichier;

        @NotBlank(message = "Le type est obligatoire")
        private String type;

        @NotBlank(message = "Le type MIME est obligatoire")
        private String typeMime;

        @NotNull(message = "Le contenu du fichier est obligatoire")
        private byte[] contenu;

        private String description;
        private Long tailleFichier;

        // Getters/Setters explicites
        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getNomFichier() { return nomFichier; }
        public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTypeMime() { return typeMime; }
        public void setTypeMime(String typeMime) { this.typeMime = typeMime; }

        public byte[] getContenu() { return contenu; }
        public void setContenu(byte[] contenu) { this.contenu = contenu; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String nom;
        private String nomFichier;
        private String type;
        private String typeMime;
        private LocalDateTime dateUpload;
        private String description;
        private Long tailleFichier;
        private Long dossierId;
        private String extension;
        private Boolean isPdf;
        private Boolean isImage;
        private Boolean isWord;

        // Getters/Setters explicites
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getNomFichier() { return nomFichier; }
        public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTypeMime() { return typeMime; }
        public void setTypeMime(String typeMime) { this.typeMime = typeMime; }

        public LocalDateTime getDateUpload() { return dateUpload; }
        public void setDateUpload(LocalDateTime dateUpload) { this.dateUpload = dateUpload; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getTailleFichier() { return tailleFichier; }
        public void setTailleFichier(Long tailleFichier) { this.tailleFichier = tailleFichier; }

        public Long getDossierId() { return dossierId; }
        public void setDossierId(Long dossierId) { this.dossierId = dossierId; }

        public String getExtension() { return extension; }
        public void setExtension(String extension) { this.extension = extension; }

        public Boolean getIsPdf() { return isPdf; }
        public void setIsPdf(Boolean isPdf) { this.isPdf = isPdf; }

        public Boolean getIsImage() { return isImage; }
        public void setIsImage(Boolean isImage) { this.isImage = isImage; }

        public Boolean getIsWord() { return isWord; }
        public void setIsWord(Boolean isWord) { this.isWord = isWord; }
    }
}
