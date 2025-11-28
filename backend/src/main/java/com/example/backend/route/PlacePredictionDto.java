package com.example.backend.route;

public class PlacePredictionDto {

    private String placeId;
    private String description;

    public PlacePredictionDto(String placeId, String description) {
        this.placeId = placeId;
        this.description = description;
    }

    public String getPlaceId() {
        return placeId;
    }

    public String getDescription() {
        return description;
    }
}