package com.str.Repositories;

import com.str.Models.Document;
import com.str.Models.DossierRetraite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Utiliser "dossier" au lieu de "dossierRetraite" pour correspondre au modèle Document
    List<Document> findByDossier(DossierRetraite dossier);

    @Query("SELECT d FROM Document d WHERE d.dossier.id = :dossierId")
    List<Document> findByDossierRetraiteId(@Param("dossierId") Long dossierId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Document d WHERE d.dossier.id = :dossierId")
    void deleteByDossierId(@Param("dossierId") Long dossierId);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.dossier.id = :dossierId")
    long countByDossierId(@Param("dossierId") Long dossierId);

    // Méthodes de recherche par type
    @Query("SELECT d FROM Document d WHERE d.type = :type")
    List<Document> findByType(@Param("type") String type);

    // Recherche par nom de fichier
    @Query("SELECT d FROM Document d WHERE d.nomFichier LIKE %:nomFichier%")
    List<Document> findByNomFichierContaining(@Param("nomFichier") String nomFichier);

    // Recherche par description
    @Query("SELECT d FROM Document d WHERE d.description LIKE %:description%")
    List<Document> findByDescriptionContaining(@Param("description") String description);
}
