package com.str.Controllers;



import com.str.DTO.PaiementDTO;
import com.str.Services.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")

public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping
    public ResponseEntity<PaiementDTO> createPaiement(
            @Valid @RequestBody PaiementDTO paiementDTO) {

        PaiementDTO created = paiementService.createPaiement(paiementDTO);
        return ResponseEntity
                .created(URI.create("/api/paiements/" + created.id()))
                .body(created);
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByDossier(
            @PathVariable UUID dossierId) {

        return ResponseEntity.ok(paiementService.getByDossier(dossierId));
    }
}