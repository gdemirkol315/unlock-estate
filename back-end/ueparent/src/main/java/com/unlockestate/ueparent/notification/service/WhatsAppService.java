package com.unlockestate.ueparent.notification.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.unlockestate.ueparent.notification.config.TwilioConfig;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);
    private TwilioConfig twilioConfig;

    @Autowired
    public WhatsAppService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    @PostConstruct
    public void initTwilio() {
        Twilio.init(twilioConfig.getSid(), twilioConfig.getToken());
    }


    public void sendMessage(String messageContent, String toNumber) {

        Message message = Message.creator(
                new com.twilio.type.PhoneNumber("whatsapp:" + toNumber),
                new com.twilio.type.PhoneNumber("whatsapp:"+ twilioConfig.getWhatsappNumber()),
                messageContent)
                        .create();
        logger.info("Whatsapp Message Status: {}", message.getStatus());
    }
}