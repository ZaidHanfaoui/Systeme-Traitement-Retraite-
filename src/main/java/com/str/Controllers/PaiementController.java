package com.str.Controllers;
import com.str.DTO.PaiementDTO;
import com.str.Services.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "http://localhost:3000")
public class PaiementController {
    private static final Logger log = LoggerFactory.getLogger(PaiementController.class);
    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody PaiementDTO request) {
        try {
            log.info("Création d'un paiement: {}", request);
            PaiementDTO created = paiementService.createPaiement(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Erreur lors de la création du paiement: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Erreur lors de la création du paiement",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/dossier/{dossierId}")
    public ResponseEntity<?> createForDossier(@PathVariable Long dossierId, @Valid @RequestBody PaiementDTO request) {
        try {
            log.info("Création d'un paiement pour le dossier {}: {}", dossierId, request);
            // S'assurer que le dossierId est défini dans la requête
            PaiementDTO paiementAvecDossier = new PaiementDTO(
                request.id(),
                request.montant(),
                request.dateVersement(),
                request.datePaiement(),
                request.typePaiement(),
                request.reference(),
                request.statut(),
                request.dateExecution(),
                dossierId
            );
            PaiementDTO created = paiementService.createPaiement(paiementAvecDossier);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Erreur lors de la création du paiement pour le dossier {}: {}", dossierId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Erreur lors de la création du paiement",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<PaiementDTO>> getAll() {
        try {
            return ResponseEntity.ok(paiementService.getAllPaiements());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des paiements: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaiementDTO> getById(@PathVariable Long id) {
        try {
            PaiementDTO paiement = paiementService.getPaiementById(id);
            return ResponseEntity.ok(paiement);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du paiement {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<PaiementDTO>> getByDossier(@PathVariable Long dossierId) {
        try {
            log.info("Récupération des paiements pour le dossier {}", dossierId);
            List<PaiementDTO> paiements = paiementService.getPaiementsByDossier(dossierId);
            return ResponseEntity.ok(paiements);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des paiements du dossier {}: {}", dossierId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaiementDTO> update(@PathVariable Long id, @Valid @RequestBody PaiementDTO dto) {
        try {
            PaiementDTO updated = paiementService.updatePaiement(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du paiement {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            paiementService.deletePaiement(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression du paiement {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}