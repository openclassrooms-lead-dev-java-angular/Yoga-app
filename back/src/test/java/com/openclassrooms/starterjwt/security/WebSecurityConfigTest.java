package com.openclassrooms.starterjwt.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private JwtAuthenticationConverter jwtAuthenticationConverter;

    @Value("${oc.app.jwtSecret}")
    private String jwtSecretKey;

    @Value("${oc.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Test
    void shouldRejectProtectedEndpointWithoutToken() throws Exception {
        mockMvc.perform(get("/api/sessions"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void passwordEncoderShouldEncodeAndMatchPassword() {
        String password = "password123";
        String encodedPassword = passwordEncoder.encode(password);

        assertThat(encodedPassword).isNotEqualTo(password);
        assertThat(passwordEncoder.matches(password, encodedPassword))
                .isTrue();
        assertThat(passwordEncoder.matches("wrongPassword", encodedPassword))
                .isFalse();
    }

    @Test
    void shouldConvertRoleClaimToGrantedAuthority() {
        Jwt jwt = Jwt.withTokenValue("token").header("alg", "HS512").claim("role", "ADMIN").build();

        var authentication = jwtAuthenticationConverter.convert(jwt);

        assertThat(authentication).isNotNull();
        assertThat(authentication.getAuthorities()).extracting("authority").containsExactly("ROLE_ADMIN");
    }

    @Test
    void shouldReturnNoAuthoritiesWhenRoleIsMissing() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "HS512")
                .claim("sub", "1")
                .build();

        var authentication = jwtAuthenticationConverter.convert(jwt);

        assertThat(authentication).isNotNull();
        assertThat(authentication.getAuthorities()).isEmpty();
    }

    @Test
    void shouldCreateJwtEncoder() {
        assertThat(jwtEncoder).isNotNull();
        assertThat(jwtEncoder).isInstanceOf(org.springframework.security.oauth2.jwt.NimbusJwtEncoder.class);
    }

    @Test
    void shouldCreateJwtDecoder() {
        assertThat(jwtDecoder).isNotNull();
        assertThat(jwtDecoder).isInstanceOf(org.springframework.security.oauth2.jwt.NimbusJwtDecoder.class);
    }

    @Test
    void shouldDecodeValidHs512Jwt() throws Exception {

        byte[] secretBytes = jwtSecretKey.getBytes(StandardCharsets.UTF_8);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject("test@test.com")
                .claim("role", "USER")
                .expirationTime(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .build();

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        SignedJWT signedJWT = new SignedJWT(header, claims);
        JWSSigner signer = new MACSigner(secretBytes);

        signedJWT.sign(signer);
        String token = signedJWT.serialize();
        Jwt decodedJwt = jwtDecoder.decode(token);

        assertThat(decodedJwt.getSubject())
                .isEqualTo("test@test.com");
        assertThat(decodedJwt.getClaimAsString("role"))
                .isEqualTo("USER");
    }

    @Test
    void shouldRejectInvalidJwt() {
        String invalidToken = "invalid.jwt.token";

        assertThatThrownBy(() -> jwtDecoder.decode(invalidToken))
                .isInstanceOf(Exception.class);
    }
}