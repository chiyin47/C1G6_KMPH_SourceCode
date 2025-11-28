package com.example.backend.route;

import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin("*")
public class DirectionsController {

    private final DirectionsService directionsService;
    private final RouteScoringService scoringService;

    public DirectionsController(DirectionsService directionsService, RouteScoringService scoringService) {
        this.directionsService = directionsService;
        this.scoringService = scoringService;
    }

    @GetMapping("/best")
    public List<RouteOption> getBestRoutes(
            @RequestParam String origin,
            @RequestParam String destination) throws Exception {

        DirectionsResult result = directionsService.getDirections(origin, destination);

        List<RouteOption> options = new ArrayList<>();

        for (DirectionsRoute route : result.routes) {
            options.add(scoringService.scoreRoute(route));
        }

        // Sort by eco-score (best first)
        options.sort(Comparator.comparingDouble(o -> o.score));

        return options;
    }
}
