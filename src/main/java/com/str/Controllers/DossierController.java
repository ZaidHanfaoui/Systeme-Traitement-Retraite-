package com.str.Controllers;

import com.str.DTO.DossierDTO;
import com.str.Enum.StatutDossier;
import com.str.Services.DossierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dossiers")
@CrossOrigin(origins = "http://localhost:3000")

public class DossierController {
    private final DossierService dossierService;


    public DossierController(DossierService dossierService) {
        this.dossierService = dossierService;
    }

    @PostMapping
    public ResponseEntity<DossierDTO> create(@RequestBody DossierDTO dto) {
        try {
            DossierDTO createdDossier = dossierService.createDossier(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDossier);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierDTO> getById(@PathVariable Long id) {
        try {
            DossierDTO dossier = dossierService.getDossierById(id);
            return ResponseEntity.ok(dossier);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DossierDTO>> getAll(
            @RequestParam(required = false) StatutDossier statut) {
        try {
            if (statut != null) {
                return ResponseEntity.ok(dossierService.getDossiersByStatut(statut));
            } else {
                return ResponseEntity.ok(dossierService.getAllDossiers());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<DossierDTO>> getByStatut(@PathVariable StatutDossier statut) {
        try {
            List<DossierDTO> dossiers = dossierService.getDossiersByStatut(statut);
            return ResponseEntity.ok(dossiers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/calculate-pension")
    public ResponseEntity<Map<String, Object>> calculatePension(@PathVariable Long id) {
        try {
            Map<String, Object> result = dossierService.calculatePension(id);

            Map<String, Object> response = new HashMap<>();

            // Récupérer le montant depuis le Map
            Double montant = (Double) result.get("montant");
            response.put("montant", Math.round(montant));

            // Récupérer les détails depuis le Map
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) result.get("details");

            Map<String, Object> responseDetails = new HashMap<>();
            responseDetails.put("salaireMoyenAnnuel", Math.round((Double) details.get("salaireMoyenAnnuel")));
            responseDetails.put("trimestresValides", details.get("trimestresValides"));
            responseDetails.put("tauxPension", Math.round((Double) details.get("tauxPension") * 100.0) / 100.0);

            response.put("details", responseDetails);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors du calcul de la pension: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<DossierDTO> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            StatutDossier statut = StatutDossier.valueOf(request.get("statut"));
            DossierDTO updatedDossier = dossierService.updateStatut(id, statut);
            return ResponseEntity.ok(updatedDossier);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DossierDTO> update(@PathVariable Long id, @RequestBody DossierDTO dto) {
        try {
            DossierDTO updatedDossier = dossierService.updateDossier(id, dto);
            return ResponseEntity.ok(updatedDossier);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            dossierService.deleteDossier(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}