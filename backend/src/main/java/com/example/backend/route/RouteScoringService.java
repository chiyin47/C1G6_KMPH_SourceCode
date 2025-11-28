package com.example.backend.route;

import com.google.maps.model.DirectionsRoute;
import org.springframework.stereotype.Service;

@Service
public class RouteScoringService {

    private static final double CAR_FUEL_EFFICIENCY = 14.0; // km per liter
    private static final double CO2_PER_LITER = 2.31; // kg of CO₂ per liter

    public RouteOption scoreRoute(DirectionsRoute route) {

        long duration = route.legs[0].duration.inSeconds;
        long durationTraffic = route.legs[0].durationInTraffic.inSeconds;
        long distance = route.legs[0].distance.inMeters;

        double distanceKm = distance / 1000.0;

        // Fuel estimate
        double fuelUsed = distanceKm / CAR_FUEL_EFFICIENCY;

        // CO₂ estimate
        double co2 = fuelUsed * CO2_PER_LITER;

        // Traffic delay
        long trafficDelay = durationTraffic - duration;
        if (trafficDelay < 0)
            trafficDelay = 0;

        // === ECO-SCORE calculation ===
        // Lower score = better
        double score = (durationTraffic / 60.0) * 0.6 + // travel time weight 60%
                distanceKm * 0.2 + // distance weight 20%
                trafficDelay / 30.0 + // traffic weight 10%
                co2 * 0.4; // CO₂ weight 10% (scaled)

        RouteOption option = new RouteOption();
        option.summary = route.summary;
        option.durationSeconds = duration;
        option.durationInTraffic = durationTraffic;
        option.distanceMeters = distance;

        option.fuelLiters = fuelUsed;
        option.co2Kg = co2;
        option.score = score;

        return option;
    }
}
