package com.mindmentor.api.auth;

import com.mindmentor.api.auth.User;
import com.mindmentor.api.auth.UserRepository;
import com.mindmentor.api.auth.dto.AuthResponse;
import com.mindmentor.api.auth.dto.LoginRequest;
import com.mindmentor.api.auth.dto.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, JwtService jwtService, UserRepository userRepository) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Find the user from database to get user details
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(
                new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name())
        );
    }
}
