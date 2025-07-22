package com.str.Repositories;

import com.str.Enum.StatutPaiement;
import com.str.Models.Paiement;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {

    // Trouver les paiements d'un dossier
    List<Paiement> findByDossierId(UUID dossierId);

    // Lister les paiements à effectuer aujourd'hui
    List<Paiement> findByDateVirementAndStatut(LocalDate date, StatutPaiement statut);

    // Mise à jour massive du statut (ex: après synchronisation bancaire)
    @Transactional
    @Modifying
    @Query("UPDATE Paiement p SET p.statut = :nouveauStatut WHERE p.id IN :ids")
    void updateStatutByIdsIn(List<UUID> ids, StatutPaiement nouveauStatut);

    List<Paiement> findByPeriode(YearMonth periode);
}