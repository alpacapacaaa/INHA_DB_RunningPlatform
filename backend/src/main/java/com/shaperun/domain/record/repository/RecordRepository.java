package com.shaperun.domain.record.repository;

import com.shaperun.domain.record.entity.RunRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<RunRecord, Long> {
}
