package com.example.backend.route;

import com.google.maps.model.AutocompletePrediction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/places")
public class PlacesController {

    @Autowired
    private PlacesService placesService;

    @GetMapping("/autocomplete")
    public List<String> getAutocomplete(@RequestParam String input) {
        try {
            AutocompletePrediction[] predictions = placesService.getAutocomplete(input);
            return Arrays.stream(predictions)
                    .map(p -> p.description)
                    .limit(4)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Log error
            return List.of();
        }
    }
}
