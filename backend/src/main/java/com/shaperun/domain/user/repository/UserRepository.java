package com.shaperun.domain.user.repository;

import com.shaperun.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);
}

