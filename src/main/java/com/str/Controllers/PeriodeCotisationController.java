package com.str.Controllers;

import com.str.DTO.PeriodeCotisationDTO;
import com.str.Models.PeriodeCotisation;
import com.str.Services.PeriodeCotisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RestController
@RequestMapping("/api/periodes")

public class PeriodeCotisationController {

    private final PeriodeCotisationService periodeService;

    public PeriodeCotisationController(PeriodeCotisationService periodeService) {
        this.periodeService = periodeService;
    }

    @PostMapping
    public ResponseEntity<PeriodeCotisationDTO> createPeriode(
            @Valid @RequestBody PeriodeCotisationDTO periodeDTO) {

        PeriodeCotisationDTO created = periodeService.createPeriode(periodeDTO);
        return ResponseEntity
                .created(URI.create("/api/periodes/" + created.id()))
                .body(created);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<PeriodeCotisationDTO>> getPeriodesByDossier(
            @PathVariable UUID dossierId) {

        return ResponseEntity.ok(periodeService.getByDossier(dossierId));
    }
}