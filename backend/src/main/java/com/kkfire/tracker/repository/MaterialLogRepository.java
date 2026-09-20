package com.kkfire.tracker.repository;

import com.kkfire.tracker.model.MaterialLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialLogRepository extends JpaRepository<MaterialLog, Long> {
    List<MaterialLog> findByFloorId(Long floorId);
}
