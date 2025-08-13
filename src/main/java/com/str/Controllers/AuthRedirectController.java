package com.str.Controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping
public class AuthRedirectController {

    @GetMapping("/")
    public void handleRoot(HttpServletResponse response) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Vérifier si l'utilisateur est VRAIMENT authentifié avec Keycloak
        boolean isAuthenticated = auth != null &&
                                 auth.isAuthenticated() &&
                                 !auth.getName().equals("anonymousUser") &&
                                 auth.getPrincipal() instanceof OidcUser;

        if (!isAuthenticated) {
            System.out.println("Utilisateur non authentifié, redirection vers Keycloak...");
            response.sendRedirect("/oauth2/authorization/keycloak");
        } else {
            System.out.println("Utilisateur authentifié avec Keycloak, redirection vers React dashboard...");
            response.sendRedirect("http://localhost:3000/dashboard?authenticated=true");
        }
    }

    @GetMapping("/login")
    public void handleLogin(HttpServletResponse response) throws IOException {
        System.out.println("Endpoint /login - Redirection forcée vers Keycloak...");
        // Forcer la redirection vers Keycloak même si une session existe
        response.sendRedirect("/oauth2/authorization/keycloak");
    }

    @GetMapping("/logout")
    public void handleLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("Déconnexion en cours...");

        // Nettoyer la session Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        // Construire l'URL de déconnexion Keycloak avec redirection vers l'interface de login
        String keycloakLogoutUrl = "http://localhost:8180/realms/STR/protocol/openid-connect/logout" +
                                  "?redirect_uri=http://localhost:8088/oauth2/authorization/keycloak";

        System.out.println("Redirection vers Keycloak logout: " + keycloakLogoutUrl);
        response.sendRedirect(keycloakLogoutUrl);
    }
}
