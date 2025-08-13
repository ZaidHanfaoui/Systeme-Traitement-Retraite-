package com.str.Services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    private static final String API_KEY = "AIzaSyDLLOgYJTPBRou6BZHFPuN6IKeoNXKUNio";
    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDLLOgYJTPBRou6BZHFPuN6IKeoNXKUNio" ;

    public String generateText(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_URL,
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("candidates")) {
            var candidates = (List<Map<String, Object>>) body.get("candidates");
            if (!candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
        }
        return "Aucune réponse générée.";
    }
    public Map<String, Object> generateTextWithSuggestions(String prompt) {
        String response = generateText(prompt);
        List<String> suggestions = getRetirementSuggestions();

        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        result.put("suggestions", suggestions);
        return result;
    }

    private List<String> getRetirementSuggestions() {
        return List.of(
                "Comment calculer ma pension de retraite ?",
                "À quel âge puis-je partir à la retraite ?",
                "Quelles sont les démarches pour mon dossier de retraite ?",
                "Comment faire une simulation de retraite ?",
                "Quels documents sont nécessaires pour ma demande ?",
                "Comment racheter des trimestres manquants ?",
                "Que faire si j'ai travaillé dans plusieurs pays ?",
                "Comment fonctionne la retraite complémentaire ?"
        );
    }
}
