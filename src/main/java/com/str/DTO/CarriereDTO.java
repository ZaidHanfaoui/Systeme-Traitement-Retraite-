package com.str.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.str.Enum.RegimeRetraite;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CarriereDTO {
    private Long id;

    @NotBlank
    private String entreprise;

    @NotBlank
    private String poste;

    private String dateDebut;

    private String dateFin;

    @Positive
    private Double salaireMoyen;

    @NotNull
    private RegimeRetraite regimeRetraite;

    @Positive
    private Integer trimestresValides;

    private Long dossierId;

    // Constructeurs
    public CarriereDTO() {}

    public CarriereDTO(Long id, String entreprise, String poste, String dateDebut, String dateFin,
                      Double salaireMoyen, RegimeRetraite regimeRetraite, Integer trimestresValides, Long dossierId) {
        this.id = id;
        this.entreprise = entreprise;
        this.poste = poste;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.salaireMoyen = salaireMoyen;
        this.regimeRetraite = regimeRetraite;
        this.trimestresValides = trimestresValides;
        this.dossierId = dossierId;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }

    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }

    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }

    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }

    public Double getSalaireMoyen() { return salaireMoyen; }
    public void setSalaireMoyen(Double salaireMoyen) { this.salaireMoyen = salaireMoyen; }

    public RegimeRetraite getRegimeRetraite() { return regimeRetraite; }
    public void setRegimeRetraite(RegimeRetraite regimeRetraite) { this.regimeRetraite = regimeRetraite; }

    public Integer getTrimestresValides() { return trimestresValides; }
    public void setTrimestresValides(Integer trimestresValides) { this.trimestresValides = trimestresValides; }

    public Long getDossierId() { return dossierId; }
    public void setDossierId(Long dossierId) { this.dossierId = dossierId; }
}
