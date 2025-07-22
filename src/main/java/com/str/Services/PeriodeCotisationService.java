package com.str.Services;

import com.str.DTO.PeriodeCotisationDTO;
import com.str.Enum.RegimeCotisation;
import com.str.Models.DossierRetraite;
import com.str.Models.PeriodeCotisation;
import com.str.Repositories.DossierRetraiteRepository;
import com.str.Repositories.PeriodeCotisationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service

public class PeriodeCotisationService {

    private final PeriodeCotisationRepository periodeRepository;
    private final DossierRetraiteRepository dossierRepository;

    public PeriodeCotisationService(PeriodeCotisationRepository periodeRepository, DossierRetraiteRepository dossierRepository) {
        this.periodeRepository = periodeRepository;
        this.dossierRepository = dossierRepository;
    }

    @Transactional
    public PeriodeCotisationDTO createPeriode(PeriodeCotisationDTO dto) {
        PeriodeCotisation periode = new PeriodeCotisation();
        // Mapping manuel
        periode.setDateDebut(dto.dateDebut());
        periode.setDateFin(dto.dateFin());
        periode.setSalaireCotise(dto.salaireCotise());
        periode.setRegime(RegimeCotisation.valueOf(dto.regime()));

        // Gestion de la relation
        if (dto.dossierId() != null) {
            DossierRetraite dossier = dossierRepository.findById(dto.dossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));
            periode.setDossier(dossier);
        }

        PeriodeCotisation saved = periodeRepository.save(periode);
        return convertToDTO(saved);
    }

    private PeriodeCotisationDTO convertToDTO(PeriodeCotisation entity) {
        return new PeriodeCotisationDTO(
                entity.getDateDebut(),
                entity.getDateFin(),
                entity.getSalaireCotise(),
                entity.getId(),
                entity.getRegime() != null ? entity.getRegime().name() : null
        );
    }

    public List<PeriodeCotisationDTO> getByDossier(UUID dossierId) {
        DossierRetraite dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        List<PeriodeCotisation> periodes = periodeRepository.findByDossier(dossier);
        return periodes.stream()
                .map(this::convertToDTO)
                .toList();
    }
}