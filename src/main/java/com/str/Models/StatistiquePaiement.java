package com.str.Models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.YearMonth;

@Entity
@Table(name = "statistiques_paiement")
@Getter @Setter @NoArgsConstructor
public class StatistiquePaiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "periode", nullable = false, unique = true)
    private YearMonth periode; // Format: 2025-07

    @Column(name = "total_verse", precision = 12, scale = 2)
    private BigDecimal totalVerse;

    @Column(name = "nombre_dossiers")
    private int nombreDossiers;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public YearMonth getPeriode() {
        return periode;
    }

    public void setPeriode(YearMonth periode) {
        this.periode = periode;
    }

    public BigDecimal getTotalVerse() {
        return totalVerse;
    }

    public void setTotalVerse(BigDecimal totalVerse) {
        this.totalVerse = totalVerse;
    }

    public int getNombreDossiers() {
        return nombreDossiers;
    }

    public void setNombreDossiers(int nombreDossiers) {
        this.nombreDossiers = nombreDossiers;
    }
}