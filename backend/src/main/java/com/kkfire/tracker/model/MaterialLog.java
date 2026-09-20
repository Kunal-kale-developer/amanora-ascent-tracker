package com.kkfire.tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_logs")
public class MaterialLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "floor_id", nullable = false)
    private Long floorId;

    @Column(name = "item_name", nullable = false)
    private String itemName; // e.g. Sprinkler Head, MS Pipe 25mm, Valve

    @Column(name = "quantity_delivered")
    private Integer quantityDelivered = 0;

    @Column(name = "quantity_installed")
    private Integer quantityInstalled = 0;

    private String unit = "nos";

    private String remarks;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // --- getters and setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFloorId() { return floorId; }
    public void setFloorId(Long floorId) { this.floorId = floorId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Integer getQuantityDelivered() { return quantityDelivered; }
    public void setQuantityDelivered(Integer quantityDelivered) { this.quantityDelivered = quantityDelivered; }

    public Integer getQuantityInstalled() { return quantityInstalled; }
    public void setQuantityInstalled(Integer quantityInstalled) { this.quantityInstalled = quantityInstalled; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
