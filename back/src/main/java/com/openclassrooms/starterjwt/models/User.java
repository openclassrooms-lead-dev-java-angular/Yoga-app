package com.openclassrooms.starterjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import java.time.LocalDateTime;


@Entity
@Table(
        name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Accessors(chain = true)
@EqualsAndHashCode(of = "id", callSuper = false)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50)
    @Email
    @Column(
        nullable = false,
        length = 50
    )
    private String email;

    @Size(max = 20)
    @Column(
        nullable = false,
        length = 20,
        name = "last_name"
    )
    private String lastName;

    @Size(max = 20)
    @Column(
        nullable = false,
        length = 20,
        name = "first_name"
    )
    private String firstName;

    @Size(max = 120)
    @Column(
        nullable = false,
        length = 120
    )
    private String password;

    @Column(nullable = false)
    private Boolean admin;

}
