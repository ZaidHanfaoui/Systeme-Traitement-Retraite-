package com.str.Services;

import com.str.DTO.DossierDTO;
import com.str.Enum.StatutDossier;
import com.str.Models.DossierRetraite;
import com.str.Repositories.DossierRetraiteRepository;
import com.str.Repositories.PeriodeCotisationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@Service

public class DossierRetraiteService {

    private final DossierRetraiteRepository dossierRepository;
    private final PeriodeCotisationRepository periodeRepository;

    public DossierRetraiteService(DossierRetraiteRepository dossierRepository, PeriodeCotisationRepository periodeRepository) {
        this.dossierRepository = dossierRepository;
        this.periodeRepository = periodeRepository;
    }

    @Transactional
    public DossierDTO createDossier(DossierDTO dossierDTO, String keycloakUserId) {
        DossierRetraite dossier = new DossierRetraite();
        // Mapping manuel
        dossier.setKeycloakUserId(keycloakUserId);
        dossier.setStatut(StatutDossier.BROUILLON);
        dossier.setDateDepot(LocalDate.now());
        dossier.setSalaireMoyen(dossierDTO.pension()); // Adaptation selon votre logique métier

        DossierRetraite savedDossier = dossierRepository.save(dossier);
        return convertToDTO(savedDossier);
    }

    public DossierDTO getDossier(UUID id, String subject) {
        DossierRetraite dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        if (!dossier.getKeycloakUserId().equals(subject)) {
            throw new SecurityException("Accès non autorisé au dossier");
        }

        return convertToDTO(dossier);
    }

    // Méthode de conversion interne
    private DossierDTO convertToDTO(DossierRetraite entity) {
        return new DossierDTO(
                entity.getId(),
                entity.getStatut() != null ? entity.getStatut().name() : null,
                entity.getDateDepot(),
                entity.getKeycloakUserId(),
                entity.getPensionMensuelle()
        );
    }

    public List<DossierDTO> getDossiersByUser(String userId) {
        List<DossierRetraite> dossiers = dossierRepository.findByKeycloakUserId(userId);
        return dossiers.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public DossierDTO validerDossier(UUID id, String userId) {
        DossierRetraite dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        if (!dossier.getKeycloakUserId().equals(userId)) {
            throw new SecurityException("Accès non autorisé au dossier");
        }

        // Logique de validation
        dossier.setStatut(StatutDossier.VALIDE);
        dossier.setDateValidation(LocalDate.now());
        dossier.setPensionMensuelle(BigDecimal.ZERO); // À adapter selon votre logique

        DossierRetraite savedDossier = dossierRepository.save(dossier);
        return convertToDTO(savedDossier);
    }
}