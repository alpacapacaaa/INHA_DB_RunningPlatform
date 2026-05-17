package com.shaperun.domain.user.entity;

import com.shaperun.domain.user.enums.RunLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", length = 20, nullable = false)
    private String userName;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", length = 20)
    private RunLevel level;

    @Column(name = "level_tested", nullable = false)
    private boolean levelTested;

    @Column(name = "last_logout_at")
    private LocalDateTime lastLogoutAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.levelTested = false;
    }

    @Builder
    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    public void updateProfile(String userName, String email, String encodedPassword) {
        if (userName != null) {
            this.userName = userName;
        }
        if (email != null) {
            this.email = email;
        }
        if (encodedPassword != null) {
            this.password = encodedPassword;
        }
    }

    public void logout() {
        this.lastLogoutAt = LocalDateTime.now();
    }

    public void updateLevel(RunLevel level) {
        this.level = level;
        this.levelTested = true;
    }
}
