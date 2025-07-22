package com.str.Repositories;

import com.str.Enum.StatutDossier;
import com.str.Models.DossierRetraite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public interface DossierRetraiteRepository extends JpaRepository<DossierRetraite, UUID> {

    // Trouver les dossiers d'un utilisateur
    List<DossierRetraite> findByKeycloakUserId(String keycloakUserId);

    // Lister les dossiers par statut (pour les RH)
    List<DossierRetraite> findByStatut(StatutDossier statut);

    // Requête personnalisée : Dossiers avec paiements en attente
    @Query("SELECT d FROM DossierRetraite d JOIN d.paiements p WHERE p.statut = 'EN_ATTENTE'")
    List<DossierRetraite> findDossiersAvecPaiementsEnAttente();

    // Compter les dossiers par statut
    long countByStatut(StatutDossier statut);


}