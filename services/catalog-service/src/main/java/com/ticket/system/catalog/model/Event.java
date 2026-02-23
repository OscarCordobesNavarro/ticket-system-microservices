package com.ticket.system.catalog.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String artist;
    @Column(nullable = false)
    private String venue;
    @Column(nullable = false)
    private LocalDateTime date;
    private String description;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<TicketType> ticketTypes = new java.util.ArrayList<>();

    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status;
}
