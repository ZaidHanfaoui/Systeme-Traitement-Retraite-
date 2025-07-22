package com.str.Services;

import com.str.DTO.PaiementDTO;
import com.str.Enum.StatutPaiement;
import com.str.Models.DossierRetraite;
import com.str.Models.Paiement;
import com.str.Repositories.DossierRetraiteRepository;
import com.str.Repositories.PaiementRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final DossierRetraiteRepository dossierRepository;

    public PaiementService(PaiementRepository paiementRepository, DossierRetraiteRepository dossierRepository) {
        this.paiementRepository = paiementRepository;
        this.dossierRepository = dossierRepository;
    }

    @Transactional
    public PaiementDTO createPaiement(PaiementDTO paiementDTO) {
        Paiement paiement = new Paiement();
        // Mapping manuel
        paiement.setMontant(paiementDTO.montant());
        paiement.setDateVirement(LocalDate.now());
        paiement.setIban(paiementDTO.iban());
        paiement.setStatut(StatutPaiement.EN_ATTENTE);

        // Gestion de la relation
        if (paiementDTO.dossierId() != null) {
            DossierRetraite dossier = dossierRepository.findById(paiementDTO.dossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));
            paiement.setDossier(dossier);
        }

        Paiement savedPaiement = paiementRepository.save(paiement);
        return convertToDTO(savedPaiement);
    }

    private PaiementDTO convertToDTO(Paiement entity) {
        return new PaiementDTO(
                entity.getDossier() != null ? entity.getDossier().getId() : null,
                entity.getIban(),
                entity.getId(),
                entity.getMontant()
        );
    }

    public List<PaiementDTO> getByDossier(UUID dossierId) {
        DossierRetraite dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        List<Paiement> paiements = paiementRepository.findByDossierId(dossierId);
        return paiements.stream()
                .map(this::convertToDTO)
                .toList();
    }
}