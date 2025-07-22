package com.str.Models;
import com.str.Enum.StatutDossier;
import com.str.Models.PeriodeCotisation;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "dossiers_retraite")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Data
public class DossierRetraite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "keycloak_user_id", nullable = false)
    private String keycloakUserId; // Référence à l'utilisateur Keycloak

    @Column(nullable = false)
    private LocalDate dateDepot;

    @Enumerated(EnumType.STRING)
    private StatutDossier statut; // BROUILLON, EN_COURS, VALIDE, REJETE

    @Column(name = "salaire_moyen", precision = 10, scale = 2)
    private BigDecimal salaireMoyen;

    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PeriodeCotisation> periodesCotisation;

    @OneToMany(mappedBy = "dossier")
    private List<Paiement> paiements;

    public BigDecimal getPensionMensuelle() {
        if (salaireMoyen == null || periodesCotisation == null || periodesCotisation.isEmpty()) {
            return BigDecimal.ZERO;
        }
        // Calcul de la pension mensuelle basée sur le salaire moyen et le nombre d'années de cotisation
        int anneesCotisees = periodesCotisation.size();
        BigDecimal tauxDeBase = new BigDecimal("0.75"); // 75% du salaire moyen
        return salaireMoyen.multiply(tauxDeBase).multiply(new BigDecimal(anneesCotisees)).divide(new BigDecimal(100));
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getKeycloakUserId() {
        return keycloakUserId;
    }

    public void setKeycloakUserId(String keycloakUserId) {
        this.keycloakUserId = keycloakUserId;
    }

    public LocalDate getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(LocalDate dateDepot) {
        this.dateDepot = dateDepot;
    }

    public StatutDossier getStatut() {
        return statut;
    }

    public void setStatut(StatutDossier statut) {
        this.statut = statut;
    }

    public BigDecimal getSalaireMoyen() {
        return salaireMoyen;
    }

    public void setSalaireMoyen(BigDecimal salaireMoyen) {
        this.salaireMoyen = salaireMoyen;
    }

    public List<PeriodeCotisation> getPeriodesCotisation() {
        return periodesCotisation;
    }

    public void setPeriodesCotisation(List<PeriodeCotisation> periodesCotisation) {
        this.periodesCotisation = periodesCotisation;
    }

    public List<Paiement> getPaiements() {
        return paiements;
    }

    public void setPaiements(List<Paiement> paiements) {
        this.paiements = paiements;
    }

    public void setDateValidation(LocalDate now) {
    }

    public void setPensionMensuelle(BigDecimal zero) {
    }
}