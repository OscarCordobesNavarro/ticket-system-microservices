package com.ticket.system.booking.scheduler;

import com.ticket.system.booking.model.Booking;
import com.ticket.system.booking.model.BookingStatus;
import com.ticket.system.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final BookingRepository bookingRepository;
    private final StringRedisTemplate redisTemplate;

    @Scheduled(fixedRate = 60000) // Ejecutar cada minuto
    @Transactional
    public void cleanupExpiredBookings() {
        log.info("Iniciando limpieza de reservas expiradas...");

        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore(
                BookingStatus.PENDING, LocalDateTime.now());

        if (expiredBookings.isEmpty()) {
            return;
        }

        log.info("Se encontraron {} reservas expiradas", expiredBookings.size());

        for (Booking booking : expiredBookings) {
            log.info("Expirando reserva {}: devolviendo stock", booking.getId());

            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);

            // Devolver el stock a Redis
            String stockKey = String.format("event:%d:ticket:%d:stock",
                    booking.getEventId(), booking.getTicketTypeId());
            redisTemplate.opsForValue().increment(stockKey, booking.getQuantity());
        }
    }
}
