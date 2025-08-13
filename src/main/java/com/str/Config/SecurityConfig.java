package com.str.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import java.util.Arrays;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            try {
                System.out.println("Authentification réussie pour: " + authentication.getName());
                System.out.println("Authorities: " + authentication.getAuthorities());

                // Rediriger vers React dashboard admin par défaut
                response.sendRedirect("http://localhost:3000/admin/dashboard");
            } catch (IOException e) {
                System.err.println("Erreur lors de la redirection après authentification: " + e.getMessage());
                response.sendRedirect("http://localhost:3000/login");
            }
        };
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            try {
                System.out.println("Début de la déconnexion...");

                // Nettoyer la session Spring
                if (authentication != null) {
                    new SecurityContextLogoutHandler().logout(request, response, authentication);
                }

                // Rediriger directement vers la page de login React
                response.sendRedirect("http://localhost:3000/login");

            } catch (IOException e) {
                System.err.println("Erreur lors de la déconnexion: " + e.getMessage());
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:8180"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Audience"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.deny())
                .contentTypeOptions(contentTypeOptions -> {})
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true))
            )
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/login", "/error", "/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/documents/upload/**").permitAll()
                .requestMatchers("/static/**", "/css/**", "/js/**", "/images/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/oauth2/authorization/keycloak")
                .successHandler(successHandler())
                .failureUrl("/login?error=true")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessHandler(logoutSuccessHandler())
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
            );

        // Redirection automatique vers Keycloak si accès à la racine sans authentification
        http
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/oauth2/authorization/keycloak");
                })
            );
        return http.build();
    }
}
