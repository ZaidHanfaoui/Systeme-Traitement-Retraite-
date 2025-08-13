package com.str.Repositories;

import com.str.Enum.RegimeRetraite;
import com.str.Models.Carriere;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarriereRepository extends JpaRepository<Carriere, Long> {

    @Query("SELECT c FROM Carriere c WHERE c.dossier.id = :dossierId")
    List<Carriere> findByDossierId(@Param("dossierId") Long dossierId);

    // Trouver les carrières par entreprise (corrigé - utilise entreprise au lieu d'employeur)
    List<Carriere> findByEntrepriseContainingIgnoreCase(String entreprise);

    // Requête pour calcul d'années de cotisation
    @Query("SELECT SUM(YEAR(c.dateFin) - YEAR(c.dateDebut)) FROM Carriere c WHERE c.dossier.id = :dossierId")
    Integer calculerAnneesCotisation(@Param("dossierId") Long dossierId);

    // Trouver par régime de retraite
    List<Carriere> findByRegimeRetraite(RegimeRetraite regimeRetraite);

    // Supprimer par dossier
    @Modifying
    @Transactional
    @Query("DELETE FROM Carriere c WHERE c.dossier.id = :dossierId")
    void deleteByDossierId(@Param("dossierId") Long dossierId);

    // Calcul du salaire moyen annuel pour un dossier
    @Query("SELECT AVG(c.salaireMoyen) FROM Carriere c WHERE c.dossier.id = :dossierId")
    Double calculerSalaireMoyenAnnuel(@Param("dossierId") Long dossierId);

    // Trouver les carrières en cours (sans date de fin)
    @Query("SELECT c FROM Carriere c WHERE c.dateFin IS NULL AND c.dossier.id = :dossierId")
    List<Carriere> findCarrieresEnCours(@Param("dossierId") Long dossierId);
}
