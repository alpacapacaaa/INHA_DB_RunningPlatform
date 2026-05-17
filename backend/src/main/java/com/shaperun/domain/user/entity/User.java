package com.shaperun.domain.user.entity;

import com.shaperun.domain.user.enums.UserGender;
import com.shaperun.domain.user.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
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
    @Column(name = "user_id", length = 20)
    private String userId;

    @Column(name = "user_name", length = 10, nullable = false)
    private String userName;

    @Column(name = "user_password", nullable = false)
    private String password;

    @Column(name = "user_birth_date", nullable = false)
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_gender", nullable = false)
    private UserGender gender;

    @Column(name = "user_email", length = 255, nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole role;

    @Column(name = "user_level", nullable = false)
    private Integer level;

    @Column(name = "user_total_distance", nullable = false)
    private Float totalDistance;

    @Column(name = "user_total_time", nullable = false)
    private Integer totalTime;

    @Column(name = "user_running_count", nullable = false)
    private Integer runningCount;

    @Column(name = "user_created_date", nullable = false, updatable = false)
    private LocalDate createdDate;

    @Column(name = "last_logout_at")
    private LocalDateTime lastLogoutAt;

    @PrePersist
    private void prePersist() {
        this.createdDate = LocalDate.now();
        this.role = UserRole.ROLE_USER;
        this.level = 1;
        this.totalDistance = 0.0f;
        this.totalTime = 0;
        this.runningCount = 0;
    }

    @Builder
    public User(String userId, String userName, String password,
            LocalDate birthDate, UserGender gender, String email) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.birthDate = birthDate;
        this.gender = gender;
        this.email = email;
    }

    public void updateProfile(String userName, UserGender gender) {
        if (userName != null) {
            this.userName = userName;
        }
        if (gender != null) {
            this.gender = gender;
        }
    }

    public void logout() {
        this.lastLogoutAt = LocalDateTime.now();
    }

    public void updateRunningStats(float distance, int time) {
        this.totalDistance += distance;
        this.totalTime += time;
        this.runningCount += 1;
    }
}
