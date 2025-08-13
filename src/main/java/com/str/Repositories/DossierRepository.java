package com.str.Repositories;

import com.str.Enum.StatutDossier;
import com.str.Models.DossierRetraite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DossierRepository extends JpaRepository<DossierRetraite, Long> {

    // Trouver par numéro de sécurité sociale (index unique)
    Optional<DossierRetraite> findByNumeroSecuriteSociale(String numeroSecuriteSociale);

    // Requête custom avec jointure
    @Query("SELECT d FROM DossierRetraite d JOIN FETCH d.carrieres WHERE d.id = :id")
    Optional<DossierRetraite> findByIdWithCarrieres(Long id);

    // Filtrage par statut
    List<DossierRetraite> findByStatut(StatutDossier statut);

    // Requête native pour statistiques
    @Query(value = """
        SELECT COUNT(d), d.statut 
        FROM DossierRetraite d 
        GROUP BY d.statut
        """, nativeQuery = true)
    List<Object[]> countByStatut();
}