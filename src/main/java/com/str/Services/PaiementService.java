package com.str.Services;

import com.str.DTO.PaiementDTO;
import com.str.Enum.TypePaiement;
import com.str.Mappers.PaiementMapper;
import com.str.Models.DossierRetraite;
import com.str.Models.Paiement;
import com.str.Repositories.DossierRepository;
import com.str.Repositories.PaiementRepository;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaiementService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final PaiementRepository paiementRepository;
    private final DossierRepository dossierRepository;
    private final PaiementMapper paiementMapper;

    public PaiementService(PaiementRepository paiementRepository, DossierRepository dossierRepository, PaiementMapper paiementMapper) {
        this.paiementRepository = paiementRepository;
        this.dossierRepository = dossierRepository;
        this.paiementMapper = paiementMapper;
    }

    public PaiementDTO createPaiement(PaiementDTO dto) {
        DossierRetraite dossier = dossierRepository.findById(dto.dossierId())
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        Paiement paiement = paiementMapper.toEntity(dto);
        paiement.setDossier(dossier);

        // Assurer que les dates sont définies
        if (paiement.getDateVersement() == null) {
            paiement.setDateVersement(LocalDate.now());
        }
        if (paiement.getDatePaiement() == null) {
            paiement.setDatePaiement(LocalDate.now());
        }

        // Générer une référence si elle n'existe pas
        if (paiement.getReference() == null || paiement.getReference().isEmpty()) {
            paiement.setReference("PAY-" + UUID.randomUUID().toString().substring(0, 8));
        }

        Paiement saved = paiementRepository.save(paiement);
        return paiementMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public PaiementDTO getPaiementById(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));
        return paiementMapper.toDto(paiement);
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getAllPaiements() {
        return paiementRepository.findAll().stream()
                .map(paiementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getPaiementsByDossier(Long dossierId) {
        return paiementRepository.findByDossierId(dossierId).stream()
                .map(paiementMapper::toDto)
                .collect(Collectors.toList());
    }

    public PaiementDTO updatePaiement(Long id, PaiementDTO dto) {
        Paiement existingPaiement = paiementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));

        // Mettre à jour les champs
        if (dto.montant() != null) {
            existingPaiement.setMontant(dto.montant());
        }
        if (dto.typePaiement() != null) {
            existingPaiement.setTypePaiement(dto.typePaiement());
        }
        if (dto.dateVersement() != null && !dto.dateVersement().trim().isEmpty()) {
            existingPaiement.setDateVersement(LocalDate.parse(dto.dateVersement(), DATE_FORMATTER));
        }
        if (dto.datePaiement() != null && !dto.datePaiement().trim().isEmpty()) {
            existingPaiement.setDatePaiement(LocalDate.parse(dto.datePaiement(), DATE_FORMATTER));
        }
        if (dto.dateExecution() != null && !dto.dateExecution().trim().isEmpty()) {
            existingPaiement.setDateExecution(LocalDate.parse(dto.dateExecution(), DATE_FORMATTER));
        }
        if (dto.reference() != null) {
            existingPaiement.setReference(dto.reference());
        }
        if (dto.statut() != null) {
            existingPaiement.setStatut(dto.statut());
        }

        Paiement saved = paiementRepository.save(existingPaiement);
        return paiementMapper.toDto(saved);
    }

    public void deletePaiement(Long id) {
        if (!paiementRepository.existsById(id)) {
            throw new EntityNotFoundException("Paiement non trouvé");
        }
        paiementRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getPaiementsByType(TypePaiement type) {
        return paiementRepository.findByTypePaiement(type).stream()
                .map(paiementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaiementDTO> getPaiementsByStatut(String statut) {
        return paiementRepository.findByStatut(statut).stream()
                .map(paiementMapper::toDto)
                .collect(Collectors.toList());
    }
}