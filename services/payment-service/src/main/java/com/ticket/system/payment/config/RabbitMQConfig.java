package com.ticket.system.payment.config; // Asegúrate que el package sea payment

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOKING_EXCHANGE = "booking.exchange";
    public static final String BOOKING_CREATED_ROUTING_KEY = "booking.created";
    public static final String BOOKING_PAYMENT_QUEUE = "booking.payment.queue";

    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(BOOKING_EXCHANGE);
    }

    @Bean
    public Queue paymentQueue() {
        return new Queue(BOOKING_PAYMENT_QUEUE);
    }

    @Bean
    public Binding binding(Queue paymentQueue, TopicExchange bookingExchange) {
        // Esto une la cola al exchange con la clave "booking.created"
        return BindingBuilder.bind(paymentQueue).to(bookingExchange).with(BOOKING_CREATED_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}