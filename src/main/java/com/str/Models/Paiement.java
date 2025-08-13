package com.str.Models;

import com.str.Enum.TypePaiement;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "paiements")
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private DossierRetraite dossier;

    @Column(nullable = false)
    private BigDecimal montant;

    @Column(name = "date_versement", nullable = false)
    private LocalDate dateVersement;

    @Column(name = "date_paiement")
    private LocalDate datePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "type_paiement")
    private TypePaiement typePaiement;

    private String reference;

    private String statut = "EN_ATTENTE";

    @Column(name = "date_execution")
    private LocalDate dateExecution;

    // Constructeurs
    public Paiement() {}

    public Paiement(Long id, DossierRetraite dossier, BigDecimal montant, LocalDate dateVersement,
                   LocalDate datePaiement, TypePaiement typePaiement, String reference,
                   String statut, LocalDate dateExecution) {
        this.id = id;
        this.dossier = dossier;
        this.montant = montant;
        this.dateVersement = dateVersement;
        this.datePaiement = datePaiement;
        this.typePaiement = typePaiement;
        this.reference = reference;
        this.statut = statut;
        this.dateExecution = dateExecution;
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

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public LocalDate getDateVersement() {
        return dateVersement;
    }

    public void setDateVersement(LocalDate dateVersement) {
        this.dateVersement = dateVersement;
    }

    public LocalDate getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDate datePaiement) {
        this.datePaiement = datePaiement;
    }

    public TypePaiement getTypePaiement() {
        return typePaiement;
    }

    public void setTypePaiement(TypePaiement typePaiement) {
        this.typePaiement = typePaiement;
    }

    // Méthode pour compatibilité avec le frontend qui utilise 'type'
    public TypePaiement getType() {
        return typePaiement;
    }

    public void setType(TypePaiement type) {
        this.typePaiement = type;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateExecution() {
        return dateExecution;
    }

    public void setDateExecution(LocalDate dateExecution) {
        this.dateExecution = dateExecution;
    }

    // Méthode utilitaire pour obtenir l'ID du dossier
    public Long getDossierId() {
        return dossier != null ? dossier.getId() : null;
    }
}