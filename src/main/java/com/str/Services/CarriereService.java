package com.str.Services;

import com.str.DTO.CarriereDTO;
import com.str.Enum.RegimeRetraite;
import com.str.Mappers.CarriereMapper;
import com.str.Models.Carriere;
import com.str.Models.DossierRetraite;
import com.str.Repositories.CarriereRepository;
import com.str.Repositories.DossierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarriereService {
    private final CarriereRepository carriereRepository;
    private final CarriereMapper carriereMapper;
    private final DossierRepository dossierRepository;

    public CarriereService(CarriereRepository carriereRepository, CarriereMapper carriereMapper, DossierRepository dossierRepository) {
        this.carriereRepository = carriereRepository;
        this.carriereMapper = carriereMapper;
        this.dossierRepository = dossierRepository;
    }

    @Transactional
    public CarriereDTO createCarriere(Long dossierId, CarriereDTO carriereDTO) {
        DossierRetraite dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier non trouvé"));

        Carriere carriere = new Carriere();
        carriere.setEntreprise(carriereDTO.getEntreprise());
        carriere.setPoste(carriereDTO.getPoste());
        carriere.setDateDebut(LocalDate.parse(carriereDTO.getDateDebut()));
        if (carriereDTO.getDateFin() != null && !carriereDTO.getDateFin().isEmpty()) {
            carriere.setDateFin(LocalDate.parse(carriereDTO.getDateFin()));
        }
        carriere.setSalaireMoyen(BigDecimal.valueOf(carriereDTO.getSalaireMoyen()));
        carriere.setRegimeRetraite(carriereDTO.getRegimeRetraite());
        carriere.setTrimestresValides(carriereDTO.getTrimestresValides());
        carriere.setDossier(dossier);

        Carriere saved = carriereRepository.save(carriere);
        return carriereMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public CarriereDTO getCarriereById(Long id) {
        Carriere carriere = carriereRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrière non trouvée"));
        return carriereMapper.toDto(carriere);
    }

    @Transactional(readOnly = true)
    public List<CarriereDTO> getAllCarrieres() {
        return carriereRepository.findAll().stream()
                .map(carriereMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CarriereDTO> getCarrieresByDossier(Long dossierId) {
        return carriereRepository.findByDossierId(dossierId).stream()
                .map(carriereMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CarriereDTO updateCarriere(Long id, CarriereDTO carriereDTO) {
        Carriere carriere = carriereRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Carrière non trouvée"));

        carriere.setEntreprise(carriereDTO.getEntreprise());
        carriere.setPoste(carriereDTO.getPoste());
        carriere.setDateDebut(LocalDate.parse(carriereDTO.getDateDebut()));
        if (carriereDTO.getDateFin() != null && !carriereDTO.getDateFin().isEmpty()) {
            carriere.setDateFin(LocalDate.parse(carriereDTO.getDateFin()));
        }
        carriere.setSalaireMoyen(BigDecimal.valueOf(carriereDTO.getSalaireMoyen()));
        carriere.setRegimeRetraite(carriereDTO.getRegimeRetraite());
        carriere.setTrimestresValides(carriereDTO.getTrimestresValides());

        Carriere updated = carriereRepository.save(carriere);
        return carriereMapper.toDto(updated);
    }

    @Transactional
    public void deleteCarriere(Long id) {
        if (!carriereRepository.existsById(id)) {
            throw new EntityNotFoundException("Carrière non trouvée");
        }
        carriereRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CarriereDTO> searchCarrieresParEntreprise(String entreprise) {
        return carriereRepository.findByEntrepriseContainingIgnoreCase(entreprise).stream()
                .map(carriereMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CarriereDTO> getCarrieresParRegime(RegimeRetraite regime) {
        return carriereRepository.findByRegimeRetraite(regime).stream()
                .map(carriereMapper::toDto)
                .collect(Collectors.toList());
    }
}