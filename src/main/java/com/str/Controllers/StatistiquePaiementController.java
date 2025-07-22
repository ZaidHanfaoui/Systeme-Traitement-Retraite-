package com.str.Controllers;

import com.str.DTO.StatistiquePaiementDTO;
import com.str.Services.StatistiquePaiementService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;


@RestController
@RequestMapping("/api/statistiques")
public class StatistiquePaiementController {

    private final StatistiquePaiementService statsService;

    public StatistiquePaiementController(StatistiquePaiementService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<StatistiquePaiementDTO> getStats(
            @RequestParam(required = false) @DateTimeFormat(pattern = "MM/yyyy") YearMonth periode) {

        if (periode != null) {
            return ResponseEntity.ok(statsService.getStatistiques(periode));
        }
        return ResponseEntity.ok(statsService.getStatistiquesGlobales());
    }

    @PostMapping("/calcul")
    public ResponseEntity<StatistiquePaiementDTO> calculateStats(
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") YearMonth periode) {

        return ResponseEntity.ok(statsService.generateStats(periode));
    }
}