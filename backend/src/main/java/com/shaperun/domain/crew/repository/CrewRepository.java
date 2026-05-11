package com.shaperun.domain.crew.repository;

import com.shaperun.domain.crew.entity.Crew;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrewRepository extends JpaRepository<Crew, Long> {
}
