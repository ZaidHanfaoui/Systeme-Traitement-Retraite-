package com.str.Repositories;

import com.str.Enum.TypePaiement;
import com.str.Models.Paiement;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    // Méthodes pour récupérer les paiements par dossier
    @Query("SELECT p FROM Paiement p WHERE p.dossier.id = :dossierId ORDER BY p.dateVersement DESC")
    List<Paiement> findByDossierIdOrderByDateVersementDesc(@Param("dossierId") Long dossierId);

    @Query("SELECT p FROM Paiement p WHERE p.dossier.id = :dossierId")
    List<Paiement> findByDossierId(@Param("dossierId") Long dossierId);

    // Trouver par type de paiement
    List<Paiement> findByTypePaiement(TypePaiement typePaiement);

    // Trouver par statut
    List<Paiement> findByStatut(String statut);

    // Trouver par référence
    Paiement findByReference(String reference);

    // Calculer le total des paiements pour un dossier
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.dossier.id = :dossierId")
    BigDecimal calculateTotalPaiementsByDossier(@Param("dossierId") Long dossierId);

    // Supprimer par dossier
    @Transactional
    @Modifying
    @Query("DELETE FROM Paiement p WHERE p.dossier.id = :dossierId")
    void deleteByDossierId(@Param("dossierId") Long dossierId);

    // Trouver les paiements entre deux dates
    List<Paiement> findByDateVersementBetween(LocalDate startDate, LocalDate endDate);
}