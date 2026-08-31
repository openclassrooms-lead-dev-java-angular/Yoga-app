package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.enums.Role;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class JwtService {

    @Value("${oc.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private final JwtEncoder jwtEncoder;

    public String generateToken(Authentication authentication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(now)
                .claim("role",  userPrincipal.getRole())
                .expiresAt(now.plusMillis(jwtExpirationMs))
                .build();

        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS512)
                .build();

        return jwtEncoder
                .encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }
}
