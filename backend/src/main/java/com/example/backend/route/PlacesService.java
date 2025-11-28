package com.example.backend.route;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.AutocompletePrediction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class PlacesService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    public AutocompletePrediction[] getAutocomplete(String input) throws Exception {
        GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(apiKey)
                .connectTimeout(5, TimeUnit.SECONDS)
                .readTimeout(5, TimeUnit.SECONDS)
                .build();

        AutocompletePrediction[] predictions = PlacesApi.queryAutocomplete(context, input).await();

        context.shutdown();
        return predictions;
    }
}
