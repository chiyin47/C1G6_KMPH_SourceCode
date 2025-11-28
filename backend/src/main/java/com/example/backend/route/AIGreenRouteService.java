package com.example.backend.route;

import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;

@Service
public class AIGreenRouteService {

    public DirectionsResult findBestRoute(DirectionsResult result) {
        if (result == null || result.routes == null || result.routes.length == 0) {
            return result;
        }

        // Find the route with the minimum distance
        DirectionsRoute bestRoute = Arrays.stream(result.routes)
                .min(Comparator.comparingLong(route -> route.legs[0].distance.inMeters))
                .orElse(result.routes[0]); // Default to the first route if something goes wrong

        // Create a new DirectionsResult containing only the best route
        DirectionsResult newResult = new DirectionsResult();
        newResult.routes = new DirectionsRoute[]{bestRoute};
        newResult.geocodedWaypoints = result.geocodedWaypoints;

        return newResult;
    }
}