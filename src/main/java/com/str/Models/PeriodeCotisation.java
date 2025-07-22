package com.str.Models;

import com.str.Enum.RegimeCotisation;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "periodes_cotisation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PeriodeCotisation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(name = "salaire_cotise", precision = 10, scale = 2)
    private BigDecimal salaireCotise;

    @Enumerated(EnumType.STRING)
    private RegimeCotisation regime; // PUBLIC, PRIVE, MIXTE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private DossierRetraite dossier;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public BigDecimal getSalaireCotise() {
        return salaireCotise;
    }

    public void setSalaireCotise(BigDecimal salaireCotise) {
        this.salaireCotise = salaireCotise;
    }

    public RegimeCotisation getRegime() {
        return regime;
    }

    public void setRegime(RegimeCotisation regime) {
        this.regime = regime;
    }

    public DossierRetraite getDossier() {
        return dossier;
    }

    public void setDossier(DossierRetraite dossier) {
        this.dossier = dossier;
    }
}
