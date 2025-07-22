package com.str.Repositories;

import com.str.Models.StatistiquePaiement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface StatistiquePaiementRepository extends JpaRepository<StatistiquePaiement, Long> {

    // Trouver les stats par mois
    Optional<StatistiquePaiement> findByPeriode(YearMonth periode);

    // Requête agrégative pour le dashboard
    @Query(value = "SELECT SUM(total_verse) FROM statistiques_paiement WHERE EXTRACT(YEAR FROM periode) = :annee",
            nativeQuery = true)
    BigDecimal getTotalVerseAnnuel(@Param("annee") int annee);

    @Query(value = "SELECT COALESCE(SUM(total_verse), 0) FROM statistiques_paiement WHERE periode = :periode",
            nativeQuery = true)
    BigDecimal sumTotalVerseByPeriodeNative(@Param("periode") YearMonth periode);
}