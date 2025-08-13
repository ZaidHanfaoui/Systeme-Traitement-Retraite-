package com.str.Models;
import com.str.Enum.StatutDossier;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;



@Entity
@Table(name = "dossiers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DossierRetraite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroSecuriteSociale;

    @Embedded
    private Beneficiaire beneficiaire;  // Données personnelles

    @Enumerated(EnumType.STRING)
    private StatutDossier statut;

    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Carriere> carrieres;

    @OneToMany(mappedBy = "dossier")
    private List<Paiement> paiements;

    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

    @Column(updatable = false)
    private LocalDate dateCreation = LocalDate.now();

    public void updateFrom(DossierRetraite source) {
        if (source.getBeneficiaire() != null) {
            this.beneficiaire = source.getBeneficiaire();
        }
        if (source.getStatut() != null) {
            this.statut = source.getStatut();
        }
        if (source.getNumeroSecuriteSociale() != null) {
            this.numeroSecuriteSociale = source.getNumeroSecuriteSociale();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroSecuriteSociale() {
        return numeroSecuriteSociale;
    }

    public void setNumeroSecuriteSociale(String numeroSecuriteSociale) {
        this.numeroSecuriteSociale = numeroSecuriteSociale;
    }

    public Beneficiaire getBeneficiaire() {
        return beneficiaire;
    }

    public void setBeneficiaire(Beneficiaire beneficiaire) {
        this.beneficiaire = beneficiaire;
    }

    public StatutDossier getStatut() {
        return statut;
    }

    public void setStatut(StatutDossier statut) {
        this.statut = statut;
    }

    public List<Carriere> getCarrieres() {
        return carrieres;
    }

    public void setCarrieres(List<Carriere> carrieres) {
        this.carrieres = carrieres;
    }

    public List<Paiement> getPaiements() {
        return paiements;
    }

    public void setPaiements(List<Paiement> paiements) {
        this.paiements = paiements;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    // Méthode pour mettre à jour le statut
    public void updateStatut(StatutDossier nouveauStatut) {
        this.statut = nouveauStatut;
    }

    // Méthodes utilitaires
    public int getNombreCarrieres() {
        return carrieres != null ? carrieres.size() : 0;
    }

    public int getNombrePaiements() {
        return paiements != null ? paiements.size() : 0;
    }

    public int getNombreDocuments() {
        return documents != null ? documents.size() : 0;
    }
}