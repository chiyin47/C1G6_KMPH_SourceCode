package com.example.backend.route;

public class RouteOption {
    public String summary;
    public long durationSeconds; // normal travel time
    public long durationInTraffic; // travel time with traffic
    public long distanceMeters;

    public double fuelLiters;
    public double co2Kg;
    public double score; // final eco-score (lower = better)
}
