package com.ticket.system.catalog.repository;

import com.ticket.system.catalog.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByArtistContainingIgnoreCase(String artist);

    List<Event> findByVenue(String venue);
}