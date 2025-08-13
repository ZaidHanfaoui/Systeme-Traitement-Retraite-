package com.str.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "*", maxAge = 3600)

public class GeminiController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        // Simulation d'une réponse du chatbot Gemini
        String response = generateResponse(message);

        return ResponseEntity.ok(Map.of("message", response));
    }

    private String generateResponse(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Je n'ai pas compris votre message. Pouvez-vous reformuler ?";
        }

        String lowerMessage = message.toLowerCase().trim();

        // Réponses basiques
        if (lowerMessage.equals("oui") || lowerMessage.equals("yes")) {
            return "Parfait ! Comment puis-je vous aider davantage ?";
        }

        if (lowerMessage.equals("non") || lowerMessage.equals("no")) {
            return "D'accord, avez-vous d'autres questions ?";
        }

        if (lowerMessage.contains("bonjour") || lowerMessage.contains("salut") || lowerMessage.contains("hello")) {
            return "Bonjour ! Je suis votre assistant virtuel pour les questions de retraite. Comment puis-je vous aider ?";
        }

        if (lowerMessage.contains("merci") || lowerMessage.contains("thank")) {
            return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
        }

        // Questions sur la retraite
        if (lowerMessage.contains("retraite") || lowerMessage.contains("pension")) {
            return "Je peux vous aider avec vos questions sur la retraite. Voulez-vous savoir comment calculer votre pension, connaître vos droits, ou autre chose ?";
        }

        if (lowerMessage.contains("calcul") || lowerMessage.contains("calculer")) {
            return "Pour calculer votre pension de retraite, nous prenons en compte vos trimestres validés, votre salaire moyen et votre âge de départ. Avez-vous une question spécifique sur le calcul ?";
        }

        if (lowerMessage.contains("trimestre")) {
            return "Les trimestres sont des périodes de cotisation qui déterminent vos droits à la retraite. Il faut généralement 160 à 172 trimestres pour une retraite à taux plein selon votre année de naissance.";
        }

        if (lowerMessage.contains("âge") || lowerMessage.contains("age")) {
            return "L'âge légal de départ à la retraite varie selon votre année de naissance. Il est généralement entre 62 et 67 ans. Voulez-vous plus de détails ?";
        }

        if (lowerMessage.contains("dossier")) {
            return "Concernant votre dossier de retraite, vous pouvez consulter son statut, ajouter des documents ou suivre l'avancement de votre demande. Que souhaitez-vous faire ?";
        }

        if (lowerMessage.contains("document")) {
            return "Vous pouvez télécharger vos documents justificatifs (bulletins de salaire, attestations, etc.) dans votre dossier. Avez-vous besoin d'aide pour l'upload ?";
        }

        if (lowerMessage.contains("carrière") || lowerMessage.contains("carriere")) {
            return "Votre carrière professionnelle influence le calcul de votre retraite. Vous pouvez consulter et mettre à jour vos périodes d'emploi dans votre dossier.";
        }

        if (lowerMessage.contains("paiement")) {
            return "Vous pouvez consulter l'historique de vos paiements de pension et vérifier les montants versés. Avez-vous une question spécifique ?";
        }

        if (lowerMessage.contains("aide") || lowerMessage.contains("help")) {
            return "Je peux vous aider avec :\n- Le calcul de votre pension\n- La gestion de votre dossier\n- Les questions sur vos droits\n- L'upload de documents\n\nQue souhaitez-vous savoir ?";
        }

        // Réponse par défaut
        return "Je comprends votre question sur '" + message + "'. Pour des questions spécifiques sur votre dossier de retraite, n'hésitez pas à consulter votre espace personnel ou à contacter notre service client.";
    }
}
