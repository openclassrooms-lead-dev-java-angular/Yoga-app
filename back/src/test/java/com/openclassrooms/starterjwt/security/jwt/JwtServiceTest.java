package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.enums.Role;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.utils.factories.UserDetailsImplTestFactory;

import com.openclassrooms.starterjwt.utils.factories.UserTestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.within;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import java.time.temporal.ChronoUnit;

@ExtendWith(MockitoExtension.class)
public class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    @Mock
    private JwtEncoder jwtEncoder;

    @Value("${oc.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private UserDetailsImpl userPrincipal;
    private Authentication authentication;
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        userPrincipal = UserDetailsImplTestFactory.createUserDetails(
                UserTestFactory.createAdminUser(),
                Role.ADMIN
        );

        authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        Jwt jwt = mock(Jwt.class);
        when(jwtEncoder.encode(any(JwtEncoderParameters.class)))
                .thenReturn(jwt);
    }

    @Test
    public void shouldGenerateTokenWithCorrectUsername() {
        when(jwt.getTokenValue()).thenReturn("fake-jwt-token");

        String generatedToken = jwtService.generateToken(authentication);

        ArgumentCaptor<JwtEncoderParameters> captor =
                ArgumentCaptor.forClass(JwtEncoderParameters.class);

        verify(jwtEncoder).encode(captor.capture());

        JwtEncoderParameters parameters = captor.getValue();

        assertThat(parameters.getClaims().getSubject())
                .isEqualTo(userPrincipal.getUsername());

        assertThat(generatedToken)
                .isNotNull()
                .isNotEmpty()
                .isEqualTo("fake-jwt-token");
    }

    @Test
    public void shouldGenerateTokenWithCorrectClaims()  {

        ArgumentCaptor<JwtEncoderParameters> captor = ArgumentCaptor.forClass(JwtEncoderParameters.class);

        jwtService.generateToken(authentication);
        verify(jwtEncoder).encode(captor.capture());

        JwtEncoderParameters parameters = captor.getValue();

        assertThat(parameters.getClaims().getSubject())
                .isEqualTo(userPrincipal.getUsername());
        assertThat(parameters.getClaims().getClaimAsString("role"))
                .isEqualTo(Role.ADMIN.toString());
        assertThat(parameters.getClaims().getIssuedAt()).isNotNull();
        assertThat(parameters.getClaims().getExpiresAt()).isNotNull();
        assertThat(parameters.getClaims().getExpiresAt()).isCloseTo(
                parameters.getClaims().getIssuedAt().plusMillis(jwtExpirationMs),
                within(1, ChronoUnit.SECONDS)
        );
    }

    @Test
    public void shouldGenerateTokenWithHs512Algorithm() {

        ArgumentCaptor<JwtEncoderParameters> captor = ArgumentCaptor.forClass(JwtEncoderParameters.class);

        jwtService.generateToken(authentication);
        verify(jwtEncoder).encode(captor.capture());

        JwtEncoderParameters parameters = captor.getValue();

        assertThat(parameters.getJwsHeader()).isNotNull();
        assertThat(parameters.getJwsHeader().getAlgorithm())
                .isNotNull()
                .isEqualTo(MacAlgorithm.HS512);
    }

    @Test
    public void shouldReturnEncodedTokenValue() {
        when(jwt.getTokenValue()).thenReturn("fake-jwt-token");

        String token = jwtService.generateToken(authentication);

        assertThat(token)
                .isNotNull()
                .isNotEmpty()
                .isEqualTo("fake-jwt-token");
    }
}
