// AuthController.java
package com.example.imageapp.controller;

import com.example.imageapp.config.JwtUtil;
import com.example.imageapp.entity.Admin;
import com.example.imageapp.repository.AdminRepository;
import com.example.imageapp.service.AdminDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminDetailsService adminDetailsService;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;

    public AuthController(AuthenticationManager authenticationManager,
            AdminDetailsService adminDetailsService,
            JwtUtil jwtUtil,
            AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.adminDetailsService = adminDetailsService;
        this.jwtUtil = jwtUtil;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        } catch (Exception e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = adminDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        Admin admin = adminRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new Exception("Admin not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("admin", admin);

        return ResponseEntity.ok(response);
    }

    public static class AuthRequest {
        private String username;
        private String password;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}