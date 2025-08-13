package com.str.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {

    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userInfo = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {

            if (authentication.getPrincipal() instanceof OidcUser) {
                OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

                // Informations de base
                userInfo.put("authenticated", true);
                userInfo.put("sub", oidcUser.getSubject());
                userInfo.put("email", oidcUser.getEmail());
                userInfo.put("name", oidcUser.getFullName());
                userInfo.put("given_name", oidcUser.getGivenName());
                userInfo.put("family_name", oidcUser.getFamilyName());
                userInfo.put("preferred_username", oidcUser.getPreferredUsername());

                // Extraction des rôles depuis les authorities Spring Security
                List<String> authorities = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
                userInfo.put("authorities", authorities);

                // Extraction des rôles depuis les claims du token
                Map<String, Object> claims = oidcUser.getClaims();

                // Rôles depuis realm_access
                if (claims.containsKey("realm_access")) {
                    Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");
                    if (realmAccess.containsKey("roles")) {
                        userInfo.put("realm_roles", realmAccess.get("roles"));
                    }
                }

                // Rôles depuis resource_access
                if (claims.containsKey("resource_access")) {
                    Map<String, Object> resourceAccess = (Map<String, Object>) claims.get("resource_access");
                    if (resourceAccess.containsKey("STR_REST_API")) {
                        Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get("STR_REST_API");
                        if (clientAccess.containsKey("roles")) {
                            userInfo.put("client_roles", clientAccess.get("roles"));
                        }
                    }
                }

                // Combiner tous les rôles
                Set<String> allRoles = new HashSet<>();
                allRoles.addAll(authorities);
                if (userInfo.containsKey("realm_roles")) {
                    allRoles.addAll((List<String>) userInfo.get("realm_roles"));
                }
                if (userInfo.containsKey("client_roles")) {
                    allRoles.addAll((List<String>) userInfo.get("client_roles"));
                }
                userInfo.put("roles", new ArrayList<>(allRoles));

                System.out.println("Utilisateur authentifié: " + oidcUser.getPreferredUsername());
                System.out.println("Rôles trouvés: " + allRoles);

                return ResponseEntity.ok(userInfo);

            } else if (authentication.getPrincipal() instanceof Jwt) {
                Jwt jwt = (Jwt) authentication.getPrincipal();

                userInfo.put("authenticated", true);
                userInfo.put("sub", jwt.getSubject());
                userInfo.put("preferred_username", jwt.getClaimAsString("preferred_username"));
                userInfo.put("email", jwt.getClaimAsString("email"));
                userInfo.put("name", jwt.getClaimAsString("name"));

                // Extraction des rôles depuis le JWT
                List<String> authorities = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
                userInfo.put("authorities", authorities);
                userInfo.put("roles", authorities);

                return ResponseEntity.ok(userInfo);
            }
        }

        System.out.println("Utilisateur non authentifié");
        userInfo.put("authenticated", false);
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/")
    public String home() {
        return "redirect:http://localhost:3000/dashboard";
    }
}
