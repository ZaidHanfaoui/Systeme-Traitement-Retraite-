package com.str.Repositories;

import com.str.Models.DossierRetraite;
import com.str.Models.PeriodeCotisation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PeriodeCotisationRepository extends JpaRepository<PeriodeCotisation, UUID> {

    // Trouver toutes les périodes d'un dossier
    List<PeriodeCotisation> findByDossier(DossierRetraite dossier);

    // Supprimer toutes les périodes d'un dossier (utilisé avant recalcul)
    void deleteAllByDossierId(UUID dossierId);

    List<PeriodeCotisation> findByDossierId(UUID dossierId);
}