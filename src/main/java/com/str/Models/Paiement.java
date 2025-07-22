package com.str.Models;

import com.str.Enum.StatutPaiement;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

@Entity
@Table(name = "paiements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal montant;

    @Column(name = "date_virement", nullable = false)
    private LocalDate dateVirement;

    @Column(nullable = false)
    private String iban; // Chiffré en base avec Jasypt ou PostgreSQL pgcrypto
    @Column(name = "periode") // Add this new field
    private YearMonth periode;


    @Enumerated(EnumType.STRING)
    private StatutPaiement statut; // EN_ATTENTE, EFFECTUE, ERREUR

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private DossierRetraite dossier;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public LocalDate getDateVirement() {
        return dateVirement;
    }

    public void setDateVirement(LocalDate dateVirement) {
        this.dateVirement = dateVirement;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public YearMonth getPeriode() {
        return periode;
    }

    public void setPeriode(YearMonth periode) {
        this.periode = periode;
    }

    public StatutPaiement getStatut() {
        return statut;
    }

    public void setStatut(StatutPaiement statut) {
        this.statut = statut;
    }

    public DossierRetraite getDossier() {
        return dossier;
    }

    public void setDossier(DossierRetraite dossier) {
        this.dossier = dossier;
    }
}