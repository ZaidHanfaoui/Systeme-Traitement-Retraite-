package com.str.Services;

import com.str.DTO.DossierDTO;
import com.str.Enum.StatutDossier;
import com.str.Mappers.DossierMapper;
import com.str.Models.DossierRetraite;
import com.str.Models.Beneficiaire;
import com.str.Repositories.DossierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DossierService {
    private final DossierRepository dossierRepository;
    private final DossierMapper dossierMapper;

    public DossierService(DossierRepository dossierRepository, DossierMapper dossierMapper) {
        this.dossierRepository = dossierRepository;
        this.dossierMapper = dossierMapper;
    }

    public DossierDTO createDossier(DossierDTO dossierDTO) {
        DossierRetraite dossier = dossierMapper.toEntity(dossierDTO);
        dossier.setStatut(StatutDossier.EN_COURS);
        dossier.setDateCreation(LocalDate.now());

        DossierRetraite savedDossier = dossierRepository.save(dossier);
        return dossierMapper.toDto(savedDossier);
    }

    @Transactional(readOnly = true)
    public DossierDTO getDossierById(Long id) {
        return dossierRepository.findById(id)
                .map(dossierMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<DossierDTO> getAllDossiers() {
        return dossierRepository.findAll()
                .stream()
                .map(dossierMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DossierDTO> getDossiersByStatut(StatutDossier statut) {
        return dossierRepository.findByStatut(statut)
                .stream()
                .map(dossierMapper::toDto)
                .toList();
    }

    public DossierDTO updateDossier(Long id, DossierDTO dossierDTO) {
        DossierRetraite existingDossier = dossierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé avec l'ID: " + id));

        // Mettre à jour les champs modifiables
        if (dossierDTO.getNumeroSecuriteSociale() != null) {
            existingDossier.setNumeroSecuriteSociale(dossierDTO.getNumeroSecuriteSociale());
        }
        if (dossierDTO.getStatut() != null) {
            existingDossier.setStatut(dossierDTO.getStatut());
        }

        // Mettre à jour les informations du bénéficiaire
        if (dossierDTO.getBeneficiaire() != null) {
            Beneficiaire beneficiaire = existingDossier.getBeneficiaire();
            if (beneficiaire == null) {
                beneficiaire = new Beneficiaire();
                existingDossier.setBeneficiaire(beneficiaire);
            }

            if (dossierDTO.getBeneficiaire().getNom() != null) {
                beneficiaire.setNom(dossierDTO.getBeneficiaire().getNom());
            }
            if (dossierDTO.getBeneficiaire().getPrenom() != null) {
                beneficiaire.setPrenom(dossierDTO.getBeneficiaire().getPrenom());
            }
            if (dossierDTO.getBeneficiaire().getEmail() != null) {
                beneficiaire.setEmail(dossierDTO.getBeneficiaire().getEmail());
            }
            if (dossierDTO.getBeneficiaire().getTelephone() != null) {
                beneficiaire.setTelephone(dossierDTO.getBeneficiaire().getTelephone());
            }
            if (dossierDTO.getBeneficiaire().getAdresse() != null) {
                beneficiaire.setAdresse(dossierDTO.getBeneficiaire().getAdresse());
            }
            if (dossierDTO.getBeneficiaire().getDateNaissance() != null) {
                beneficiaire.setDateNaissance(dossierDTO.getBeneficiaire().getDateNaissance());
            }
            }


        DossierRetraite updatedDossier = dossierRepository.save(existingDossier);
        return dossierMapper.toDto(updatedDossier);
    }

    public DossierDTO updateStatut(Long id, StatutDossier nouveauStatut) {
        DossierRetraite dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé avec l'ID: " + id));

        dossier.setStatut(nouveauStatut);
        DossierRetraite updatedDossier = dossierRepository.save(dossier);
        return dossierMapper.toDto(updatedDossier);
    }

    public void deleteDossier(Long id) {
        if (!dossierRepository.existsById(id)) {
            throw new EntityNotFoundException("Dossier non trouvé avec l'ID: " + id);
        }
        dossierRepository.deleteById(id);
    }

    public Map<String, Object> calculatePension(Long dossierId) {
        DossierRetraite dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé avec l'ID: " + dossierId));

        // Calcul simplifié de la pension basé sur les carrières
        double salaireMoyenAnnuel = 0.0;
        int trimestresValides = 0;

        if (dossier.getCarrieres() != null && !dossier.getCarrieres().isEmpty()) {
            salaireMoyenAnnuel = dossier.getCarrieres().stream()
                    .mapToDouble(carriere -> carriere.getSalaireMoyen() != null ? carriere.getSalaireMoyen().doubleValue() : 0)
                    .average()
                    .orElse(0.0);

            trimestresValides = dossier.getCarrieres().stream()
                    .mapToInt(carriere -> carriere.getTrimestresValides() != null ? carriere.getTrimestresValides() : 0)
                    .sum();
        }

        // Formule simplifiée : 50% du salaire moyen si 160 trimestres ou plus
        double tauxPension = Math.min(50.0, (trimestresValides / 160.0) * 50.0);
        double montantPension = (salaireMoyenAnnuel * tauxPension) / 100.0;

        Map<String, Object> resultat = new HashMap<>();
        resultat.put("montant", BigDecimal.valueOf(montantPension));

        Map<String, Object> details = new HashMap<>();
        details.put("salaireMoyenAnnuel", salaireMoyenAnnuel);
        details.put("trimestresValides", trimestresValides);
        details.put("tauxPension", tauxPension);
        resultat.put("details", details);

        return resultat;
    }
}