package com.kkfire.tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "floors")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "floor_number", nullable = false, unique = true)
    private String floorNumber; // B1, GF, 1..7

    @Column(name = "floor_label")
    private String floorLabel;

    @Column(nullable = false)
    private String status = "RED"; // RED / YELLOW / GREEN

    @Column(name = "total_sprinklers")
    private Integer totalSprinklers = 0;

    @Column(name = "installed_sprinklers")
    private Integer installedSprinklers = 0;

    @Column(name = "tested_sprinklers")
    private Integer testedSprinklers = 0;

    private String notes;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // --- getters and setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFloorNumber() { return floorNumber; }
    public void setFloorNumber(String floorNumber) { this.floorNumber = floorNumber; }

    public String getFloorLabel() { return floorLabel; }
    public void setFloorLabel(String floorLabel) { this.floorLabel = floorLabel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTotalSprinklers() { return totalSprinklers; }
    public void setTotalSprinklers(Integer totalSprinklers) { this.totalSprinklers = totalSprinklers; }

    public Integer getInstalledSprinklers() { return installedSprinklers; }
    public void setInstalledSprinklers(Integer installedSprinklers) { this.installedSprinklers = installedSprinklers; }

    public Integer getTestedSprinklers() { return testedSprinklers; }
    public void setTestedSprinklers(Integer testedSprinklers) { this.testedSprinklers = testedSprinklers; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
