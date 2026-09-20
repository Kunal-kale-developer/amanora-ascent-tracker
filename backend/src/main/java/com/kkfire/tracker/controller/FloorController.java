package com.kkfire.tracker.controller;

import com.kkfire.tracker.model.Floor;
import com.kkfire.tracker.model.FloorPhoto;
import com.kkfire.tracker.model.HydroTest;
import com.kkfire.tracker.model.MaterialLog;
import com.kkfire.tracker.repository.FloorPhotoRepository;
import com.kkfire.tracker.repository.FloorRepository;
import com.kkfire.tracker.repository.HydroTestRepository;
import com.kkfire.tracker.repository.MaterialLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FloorController {

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private HydroTestRepository hydroTestRepository;

    @Autowired
    private MaterialLogRepository materialLogRepository;

    @Autowired
    private FloorPhotoRepository floorPhotoRepository;

    // GET /api/floors -> for the corporate view / engineer dashboard
    @GetMapping("/floors")
    public List<Floor> getAllFloors() {
        return floorRepository.findAll();
    }

    // GET /api/floors/{floorNumber}
    @GetMapping("/floors/{floorNumber}")
    public Floor getFloor(@PathVariable String floorNumber) {
        return floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
    }

    // PATCH /api/floors/{floorNumber}/status -> technician updates status (RED/YELLOW/GREEN)
    @PatchMapping("/floors/{floorNumber}/status")
    public Floor updateStatus(@PathVariable String floorNumber, @RequestBody StatusUpdateRequest req) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        floor.setStatus(req.status);
        if (req.notes != null) floor.setNotes(req.notes);
        if (req.updatedBy != null) floor.setUpdatedBy(req.updatedBy);
        if (req.installedSprinklers != null) floor.setInstalledSprinklers(req.installedSprinklers);
        if (req.testedSprinklers != null) floor.setTestedSprinklers(req.testedSprinklers);
        floor.setUpdatedAt(LocalDateTime.now());
        return floorRepository.save(floor);
    }

    // POST /api/floors/{floorNumber}/hydro-test -> technician logs a hydro test result
    @PostMapping("/floors/{floorNumber}/hydro-test")
    public HydroTest addHydroTest(@PathVariable String floorNumber, @RequestBody HydroTest test) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        test.setFloorId(floor.getId());
        HydroTest saved = hydroTestRepository.save(test);

        // auto-flip to GREEN if the test passed
        if ("PASS".equalsIgnoreCase(test.getStatus())) {
            floor.setStatus("GREEN");
            floorRepository.save(floor);
        }
        return saved;
    }

    // GET /api/floors/{floorNumber}/hydro-tests
    @GetMapping("/floors/{floorNumber}/hydro-tests")
    public List<HydroTest> getHydroTests(@PathVariable String floorNumber) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        return hydroTestRepository.findByFloorId(floor.getId());
    }

    // POST /api/floors/{floorNumber}/material -> log delivered/installed material
    @PostMapping("/floors/{floorNumber}/material")
    public MaterialLog addMaterial(@PathVariable String floorNumber, @RequestBody MaterialLog log) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        log.setFloorId(floor.getId());
        return materialLogRepository.save(log);
    }

    // POST /api/floors/{floorNumber}/photo -> save a photo taken during the walk (base64)
    @PostMapping("/floors/{floorNumber}/photo")
    public FloorPhoto addPhoto(@PathVariable String floorNumber, @RequestBody FloorPhoto photo) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        photo.setFloorId(floor.getId());
        return floorPhotoRepository.save(photo);
    }

    // GET /api/floors/{floorNumber}/photos
    @GetMapping("/floors/{floorNumber}/photos")
    public List<FloorPhoto> getPhotos(@PathVariable String floorNumber) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));
        return floorPhotoRepository.findByFloorId(floor.getId());
    }

    // POST /api/floors/{floorNumber}/walk-update -> ONE call from the site-walk screen:
    // saves checklist-derived status, notes, and an optional photo together.
    @PostMapping("/floors/{floorNumber}/walk-update")
    public Floor walkUpdate(@PathVariable String floorNumber, @RequestBody WalkUpdateRequest req) {
        Floor floor = floorRepository.findByFloorNumber(floorNumber)
                .orElseThrow(() -> new RuntimeException("Floor not found: " + floorNumber));

        floor.setStatus(req.status);
        floor.setNotes(req.notes);
        floor.setUpdatedBy(req.updatedBy);
        floor.setUpdatedAt(LocalDateTime.now());
        floorRepository.save(floor);

        if (req.photoData != null && !req.photoData.isEmpty()) {
            FloorPhoto photo = new FloorPhoto();
            photo.setFloorId(floor.getId());
            photo.setPhotoData(req.photoData);
            photo.setCaption(req.photoCaption);
            photo.setTakenBy(req.updatedBy);
            floorPhotoRepository.save(photo);
        }
        return floor;
    }

    // Simple request body for status updates
    public static class StatusUpdateRequest {
        public String status;
        public String notes;
        public String updatedBy;
        public Integer installedSprinklers;
        public Integer testedSprinklers;
    }

    // Request body for the one-tap site-walk update
    public static class WalkUpdateRequest {
        public String status;        // RED / YELLOW / GREEN — derived from the checklist on the frontend
        public String notes;         // damage/remarks free text
        public String updatedBy;
        public String photoData;     // base64, optional
        public String photoCaption;  // optional
    }
}
