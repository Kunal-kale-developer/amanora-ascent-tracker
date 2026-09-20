package com.kkfire.tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "floor_photos")
public class FloorPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "floor_id", nullable = false)
    private Long floorId;

    @Lob
    @Column(name = "photo_data")
    private String photoData; // base64

    private String caption;

    @Column(name = "taken_by")
    private String takenBy;

    @Column(name = "taken_at")
    private LocalDateTime takenAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFloorId() { return floorId; }
    public void setFloorId(Long floorId) { this.floorId = floorId; }

    public String getPhotoData() { return photoData; }
    public void setPhotoData(String photoData) { this.photoData = photoData; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getTakenBy() { return takenBy; }
    public void setTakenBy(String takenBy) { this.takenBy = takenBy; }

    public LocalDateTime getTakenAt() { return takenAt; }
    public void setTakenAt(LocalDateTime takenAt) { this.takenAt = takenAt; }
}
