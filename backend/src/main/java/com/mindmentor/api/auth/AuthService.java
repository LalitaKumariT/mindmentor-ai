package com.mindmentor.api.auth;

import com.mindmentor.api.auth.dto.AuthResponse;
import com.mindmentor.api.auth.dto.LoginRequest;
import com.mindmentor.api.auth.dto.SignupRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User(request.getName(), request.getEmail(), passwordEncoder.encode(request.getPassword()), Role.USER);

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (user.isBlocked()) {
            throw new IllegalStateException("User is blocked");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
