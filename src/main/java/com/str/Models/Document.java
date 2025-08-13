package com.str.Models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id", nullable = false)
    private DossierRetraite dossier;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String nomFichier;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String typeMime;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] contenu;

    @Column(nullable = false)
    private LocalDateTime dateUpload;

    @Column
    private String description;

    @Column
    private Long tailleFichier;

    // Constructeurs
    public Document() {}

    public Document(Long id, DossierRetraite dossier, String nom, String nomFichier,
                   String type, String typeMime, byte[] contenu, LocalDateTime dateUpload,
                   String description, Long tailleFichier) {
        this.id = id;
        this.dossier = dossier;
        this.nom = nom;
        this.nomFichier = nomFichier;
        this.type = type;
        this.typeMime = typeMime;
        this.contenu = contenu;
        this.dateUpload = dateUpload;
        this.description = description;
        this.tailleFichier = tailleFichier;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DossierRetraite getDossier() {
        return dossier;
    }

    public void setDossier(DossierRetraite dossier) {
        this.dossier = dossier;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNomFichier() {
        return nomFichier;
    }

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeMime() {
        return typeMime;
    }

    public void setTypeMime(String typeMime) {
        this.typeMime = typeMime;
    }

    public byte[] getContenu() {
        return contenu;
    }

    public void setContenu(byte[] contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDateUpload() {
        return dateUpload;
    }

    public void setDateUpload(LocalDateTime dateUpload) {
        this.dateUpload = dateUpload;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getTailleFichier() {
        return tailleFichier;
    }

    public void setTailleFichier(Long tailleFichier) {
        this.tailleFichier = tailleFichier;
    }

    // Méthodes utilitaires
    public String getExtension() {
        if (nomFichier != null && nomFichier.contains(".")) {
            return nomFichier.substring(nomFichier.lastIndexOf(".") + 1).toLowerCase();
        }
        return "";
    }

    public boolean isPdf() {
        return "pdf".equals(getExtension());
    }

    public boolean isImage() {
        String ext = getExtension();
        return ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("gif");
    }

    public boolean isWord() {
        String ext = getExtension();
        return ext.equals("doc") || ext.equals("docx");
    }

    public Long getTaille() {
        return tailleFichier;
    }
}