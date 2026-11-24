package com.vgo.flashcards.config;

import io.github.openspacedrepetition.Scheduler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FsrsConfig {
    @Bean
    public Scheduler fsrsScheduler() {
        return Scheduler.builder()
                .desiredRetention(0.9)
                .maximumInterval(36500)
                .enableFuzzing(true)
                .build();
    }
}
