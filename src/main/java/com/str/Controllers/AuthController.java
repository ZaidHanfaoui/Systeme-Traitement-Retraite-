//package com.str.Controllers;
//
//
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @GetMapping("/me")
//    public String getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
//        return "User ID: " + jwt.getSubject() + ", Email: " + jwt.getClaimAsString("email");
//    }
//}