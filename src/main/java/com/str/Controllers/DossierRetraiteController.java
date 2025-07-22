package com.str.Controllers;

import com.str.DTO.DossierDTO;
import com.str.Models.DossierRetraite;
import com.str.Services.DossierRetraiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dossiers")
public class DossierRetraiteController {

    private final DossierRetraiteService dossierService;

    public DossierRetraiteController(DossierRetraiteService dossierService) {
        this.dossierService = dossierService;
    }

    @PostMapping
    public ResponseEntity<DossierDTO> createDossier(
            @RequestBody DossierDTO dossierDTO,
            @RequestHeader("X-User-Id") String userId) {

        DossierDTO created = dossierService.createDossier(dossierDTO, userId);
        return ResponseEntity
                .created(URI.create("/api/dossiers/" + created.id()))
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierDTO> getDossier(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {

        return ResponseEntity.ok(dossierService.getDossier(id, userId));
    }

    @GetMapping
    public ResponseEntity<List<DossierDTO>> getUserDossiers(
            @RequestHeader("X-User-Id") String userId) {

        return ResponseEntity.ok(dossierService.getDossiersByUser(userId));
    }

    @PatchMapping("/{id}/validation")
    public ResponseEntity<DossierDTO> validateDossier(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String userId) {

        return ResponseEntity.ok(dossierService.validerDossier(id, userId));
    }
}