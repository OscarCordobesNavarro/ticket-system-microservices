package com.ticket.system.booking.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOKING_EXCHANGE = "booking.exchange";
    public static final String BOOKING_CREATED_ROUTING_KEY = "booking.created";
    public static final String BOOKING_FAILED_ROUTING_KEY = "booking.failed";
    public static final String BOOKING_FAILED_QUEUE = "booking.failed.queue";
    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment.success";
    public static final String PAYMENT_SUCCESS_QUEUE = "payment.success.queue";

    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(BOOKING_EXCHANGE);
    }

    @Bean
    public Queue failedQueue() {
        return new Queue(BOOKING_FAILED_QUEUE);
    }

    @Bean
    public Queue successQueue() {
        return new Queue(PAYMENT_SUCCESS_QUEUE);
    }

    @Bean
    public Binding failedBinding(Queue failedQueue, TopicExchange bookingExchange) {
        return BindingBuilder.bind(failedQueue).to(bookingExchange).with(BOOKING_FAILED_ROUTING_KEY);
    }

    @Bean
    public Binding successBinding(Queue successQueue, TopicExchange bookingExchange) {
        return BindingBuilder.bind(successQueue).to(bookingExchange).with(PAYMENT_SUCCESS_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
