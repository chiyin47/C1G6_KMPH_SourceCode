package com.example.backend.route;

import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsLeg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RouteController {

    private final DirectionsService directionsService;
    private final GreenRouteService greenRouteService;
    private long counter = 0;

    // Average fuel efficiency in kilometers per liter.
    private static final double AVERAGE_FUEL_EFFICIENCY_KMPL = 12.0;

    @Autowired
    public RouteController(DirectionsService directionsService, GreenRouteService greenRouteService) {
        this.directionsService = directionsService;
        this.greenRouteService = greenRouteService;
    }

    @GetMapping("/route")
    public Route route(@RequestParam(value = "origin") String origin,
                       @RequestParam(value = "destination") String destination) {
        counter++;
        try {
            DirectionsResult directionsResult = directionsService.getDirections(origin, destination);
            DirectionsResult greenRoute = greenRouteService.getGreenRoute(directionsResult);
            if (greenRoute.routes != null && greenRoute.routes.length > 0) {
                DirectionsLeg leg = greenRoute.routes[0].legs[0];
                String distance = leg.distance.humanReadable;
                String duration = leg.duration.humanReadable;

                // Calculate fuel used
                double distanceInKm = leg.distance.inMeters / 1000.0;
                double fuelUsedInLiters = distanceInKm / AVERAGE_FUEL_EFFICIENCY_KMPL;
                String fuelUsed = String.format("Approx. %.1f liters", fuelUsedInLiters);

                return new Route(counter, greenRoute.routes[0].summary, distance, duration, fuelUsed);
            } else {
                return new Route(counter, "No routes found.", "", "", "");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Route(counter, "Error while fetching directions.", "", "", "");
        }
    }
}