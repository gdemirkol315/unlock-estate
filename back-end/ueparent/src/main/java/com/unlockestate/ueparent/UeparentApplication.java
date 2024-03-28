package com.unlockestate.ueparent;

import com.unlockestate.ueparent.notification.config.TwilioConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(TwilioConfig.class)
public class UeparentApplication {

	public static void main(String[] args) {
		SpringApplication.run(UeparentApplication.class, args);
	}

}
