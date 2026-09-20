package com.kkfire.tracker.repository;

import com.kkfire.tracker.model.HydroTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HydroTestRepository extends JpaRepository<HydroTest, Long> {
    List<HydroTest> findByFloorId(Long floorId);
}
