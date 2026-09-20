package com.kkfire.tracker.repository;

import com.kkfire.tracker.model.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    Optional<Floor> findByFloorNumber(String floorNumber);
}
