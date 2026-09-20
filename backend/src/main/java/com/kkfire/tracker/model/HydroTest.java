package com.kkfire.tracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hydro_tests")
public class HydroTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "floor_id", nullable = false)
    private Long floorId;

    @Column(name = "pressure_bar")
    private Double pressureBar;

    @Column(name = "test_date")
    private LocalDate testDate = LocalDate.now();

    @Column(nullable = false)
    private String status; // PASS / FAIL

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "tested_by")
    private String testedBy;

    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- getters and setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFloorId() { return floorId; }
    public void setFloorId(Long floorId) { this.floorId = floorId; }

    public Double getPressureBar() { return pressureBar; }
    public void setPressureBar(Double pressureBar) { this.pressureBar = pressureBar; }

    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getTestedBy() { return testedBy; }
    public void setTestedBy(String testedBy) { this.testedBy = testedBy; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
