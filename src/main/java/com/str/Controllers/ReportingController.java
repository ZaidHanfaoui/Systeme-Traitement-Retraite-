package com.str.Controllers;

import com.str.Services.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportingController {

    @Autowired
    private ReportingService reportingService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(reportingService.getDashboardStatistics());
    }

    @GetMapping("/monthly-stats")
    public ResponseEntity<Map<String, Object>> getMonthlyStats() {
        return ResponseEntity.ok(reportingService.getMonthlyStatistics());
    }
}
