package com.str.Models;

import com.str.Enum.RegimeRetraite;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "carrieres")
public class Carriere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id")
    private DossierRetraite dossier;

    @Column(name = "entreprise", nullable = false)
    private String entreprise;

    @Column(nullable = false)
    private String poste;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "salaire_moyen", precision = 10, scale = 2)
    private BigDecimal salaireMoyen;

    @Enumerated(EnumType.STRING)
    @Column(name = "regime_retraite", nullable = false)
    private RegimeRetraite regimeRetraite;

    @Column(name = "trimestres_valides")
    private Integer trimestresValides;

    // Constructeurs
    public Carriere() {}

    public Carriere(Long id, DossierRetraite dossier, String entreprise, String poste,
                   LocalDate dateDebut, LocalDate dateFin, BigDecimal salaireMoyen,
                   RegimeRetraite regimeRetraite, Integer trimestresValides) {
        this.id = id;
        this.dossier = dossier;
        this.entreprise = entreprise;
        this.poste = poste;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.salaireMoyen = salaireMoyen;
        this.regimeRetraite = regimeRetraite;
        this.trimestresValides = trimestresValides;
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

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
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

    public BigDecimal getSalaireMoyen() {
        return salaireMoyen;
    }

    public void setSalaireMoyen(BigDecimal salaireMoyen) {
        this.salaireMoyen = salaireMoyen;
    }

    public RegimeRetraite getRegimeRetraite() {
        return regimeRetraite;
    }

    public void setRegimeRetraite(RegimeRetraite regimeRetraite) {
        this.regimeRetraite = regimeRetraite;
    }

    public Integer getTrimestresValides() {
        return trimestresValides;
    }

    public void setTrimestresValides(Integer trimestresValides) {
        this.trimestresValides = trimestresValides;
    }

    // Méthodes pour compatibilité avec le frontend
    public String getEmployeur() {
        return entreprise;
    }

    public void setEmployeur(String employeur) {
        this.entreprise = employeur;
    }

    public RegimeRetraite getRegime() {
        return regimeRetraite;
    }

    public void setRegime(RegimeRetraite regime) {
        this.regimeRetraite = regime;
    }

    public BigDecimal getSalaireMoyenAnnuel() {
        return salaireMoyen;
    }

    public void setSalaireMoyenAnnuel(BigDecimal salaireMoyenAnnuel) {
        this.salaireMoyen = salaireMoyenAnnuel;
    }

    public Integer getAnneesCotisation() {
        if (dateDebut != null && dateFin != null) {
            return dateFin.getYear() - dateDebut.getYear();
        }
        return 0;
    }

    // Méthode utilitaire pour obtenir l'ID du dossier
    public Long getDossierId() {
        return dossier != null ? dossier.getId() : null;
    }
}