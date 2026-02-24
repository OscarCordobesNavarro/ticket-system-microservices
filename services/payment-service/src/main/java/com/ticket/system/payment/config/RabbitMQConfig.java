package com.ticket.system.payment.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOKING_EXCHANGE = "booking.exchange";

    // Routing key para recibir el evento de reserva creada desde booking-service
    public static final String BOOKING_CREATED_ROUTING_KEY = "booking.created";
    public static final String BOOKING_PAYMENT_QUEUE = "booking.payment.queue";

    // Routing keys para publicar el resultado del pago
    // Routing key que escucha booking-service para confirmar/cancelar la reserva
    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment.success";
    public static final String BOOKING_FAILED_ROUTING_KEY = "booking.failed";

    // Routing key que escucha notification-service para enviar el email al usuario
    public static final String NOTIFICATION_ROUTING_KEY = "notification.event";
    public static final String NOTIFICATION_QUEUE = "notification.queue";

    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(BOOKING_EXCHANGE);
    }

    @Bean
    public Queue paymentQueue() {
        return new Queue(BOOKING_PAYMENT_QUEUE);
    }

    @Bean
    public Binding paymentQueueBinding(Queue paymentQueue, TopicExchange bookingExchange) {
        return BindingBuilder.bind(paymentQueue).to(bookingExchange).with(BOOKING_CREATED_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}