package com.kkfire.tracker.repository;

import com.kkfire.tracker.model.FloorPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FloorPhotoRepository extends JpaRepository<FloorPhoto, Long> {
    List<FloorPhoto> findByFloorId(Long floorId);
}
