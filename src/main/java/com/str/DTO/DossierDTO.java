package com.str.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.str.Enum.StatutDossier;
import com.str.Models.Beneficiaire;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DossierDTO {
    private Long id;

    @NotBlank(groups = {Create.class, Update.class})
    @Size(min = 15, max = 15, groups = {Create.class, Update.class})
    private String numeroSecuriteSociale;

    @Valid
    private Beneficiaire beneficiaire;

    private StatutDossier statut;

    private List<CarriereDTO> carrieres;

    private List<PaiementDTO> paiements;

    private List<DocumentDTO> documents;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateCreation;

    private BigDecimal pensionMensuelle;

    private Integer age;

    // Constructeurs
    public DossierDTO() {}

    public DossierDTO(Long id, String numeroSecuriteSociale, Beneficiaire beneficiaire,
                     StatutDossier statut, List<CarriereDTO> carrieres,
                     List<PaiementDTO> paiements, List<DocumentDTO> documents,
                     LocalDate dateCreation, BigDecimal pensionMensuelle, Integer age) {
        this.id = id;
        this.numeroSecuriteSociale = numeroSecuriteSociale;
        this.beneficiaire = beneficiaire;
        this.statut = statut;
        this.carrieres = carrieres;
        this.paiements = paiements;
        this.documents = documents;
        this.dateCreation = dateCreation;
        this.pensionMensuelle = pensionMensuelle;
        this.age = age;
    }

    // Getters et Setters
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

    public List<CarriereDTO> getCarrieres() {
        return carrieres;
    }

    public void setCarrieres(List<CarriereDTO> carrieres) {
        this.carrieres = carrieres;
    }

    public List<PaiementDTO> getPaiements() {
        return paiements;
    }

    public void setPaiements(List<PaiementDTO> paiements) {
        this.paiements = paiements;
    }

    public List<DocumentDTO> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentDTO> documents) {
        this.documents = documents;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public BigDecimal getPensionMensuelle() {
        return pensionMensuelle;
    }

    public void setPensionMensuelle(BigDecimal pensionMensuelle) {
        this.pensionMensuelle = pensionMensuelle;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    // Groupes de validation
    public interface Create {}
    public interface Update {}
    public interface Response {}

    // Méthodes factory pour création
    public static DossierDTO forCreate(String numeroSecuriteSociale, Beneficiaire beneficiaire) {
        DossierDTO dto = new DossierDTO();
        dto.setNumeroSecuriteSociale(numeroSecuriteSociale);
        dto.setBeneficiaire(beneficiaire);
        dto.setStatut(StatutDossier.EN_COURS);
        dto.setDateCreation(LocalDate.now());
        return dto;
    }

    // Méthode pour la réponse complète
    public static DossierDTO forResponse(Long id, String numeroSecuriteSociale, Beneficiaire beneficiaire,
                                        StatutDossier statut, LocalDate dateCreation,
                                        List<CarriereDTO> carrieres, List<PaiementDTO> paiements,
                                        List<DocumentDTO> documents, BigDecimal pensionMensuelle) {
        return new DossierDTO(id, numeroSecuriteSociale, beneficiaire, statut, carrieres,
                             paiements, documents, dateCreation, pensionMensuelle, null);
    }
}