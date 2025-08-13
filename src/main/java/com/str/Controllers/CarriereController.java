package com.str.Controllers;

import com.str.DTO.CarriereDTO;
import com.str.Enum.RegimeRetraite;
import com.str.Services.CarriereService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/carrieres")
@CrossOrigin(origins = "http://localhost:3000")
public class CarriereController {
    private final CarriereService carriereService;

    public CarriereController(CarriereService carriereService) {
        this.carriereService = carriereService;
    }

    @PostMapping
    public ResponseEntity<CarriereDTO> create(@Valid @RequestBody CarriereDTO request) {
        try {
            CarriereDTO created = carriereService.createCarriere(request.getDossierId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/dossier/{dossierId}")
    public ResponseEntity<CarriereDTO> createForDossier(
            @PathVariable Long dossierId,
            @Valid @RequestBody CarriereDTO dto) {
        try {
            CarriereDTO created = carriereService.createCarriere(dossierId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CarriereDTO>> getAll() {
        try {
            List<CarriereDTO> carrieres = carriereService.getAllCarrieres();
            return ResponseEntity.ok(carrieres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarriereDTO> getById(@PathVariable Long id) {
        try {
            CarriereDTO carriere = carriereService.getCarriereById(id);
            return ResponseEntity.ok(carriere);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<CarriereDTO>> getByDossier(@PathVariable Long dossierId) {
        try {
            List<CarriereDTO> carrieres = carriereService.getCarrieresByDossier(dossierId);
            return ResponseEntity.ok(carrieres);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarriereDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CarriereDTO dto) {
        try {
            CarriereDTO updated = carriereService.updateCarriere(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            carriereService.deleteCarriere(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarriereDTO>> searchByEntreprise(@RequestParam String entreprise) {
        try {
            List<CarriereDTO> carrieres = carriereService.searchCarrieresParEntreprise(entreprise);
            return ResponseEntity.ok(carrieres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/regime/{regime}")
    public ResponseEntity<List<CarriereDTO>> getByRegime(@PathVariable RegimeRetraite regime) {
        try {
            List<CarriereDTO> carrieres = carriereService.getCarrieresParRegime(regime);
            return ResponseEntity.ok(carrieres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}