package com.example.backend.route;

public class Route {
    private final long id;
    private final String content;
    private final String distance;
    private final String duration;
    private final String fuelUsed;

    public Route(long id, String content, String distance, String duration, String fuelUsed) {
        this.id = id;
        this.content = content;
        this.distance = distance;
        this.duration = duration;
        this.fuelUsed = fuelUsed;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public String getDistance() {
        return distance;
    }

    public String getDuration() {
        return duration;
    }

    public String getFuelUsed() {
        return fuelUsed;
    }
}