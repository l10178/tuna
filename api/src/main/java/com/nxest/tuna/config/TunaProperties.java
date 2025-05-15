package com.nxest.tuna.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "tuna")
public class TunaProperties {

    @NestedConfigurationProperty
    private KeycloakProperties keycloak = new KeycloakProperties();

    @Data
    public static class KeycloakProperties {
        private String serverUrl;
        private String realm;
        private String clientId;
        private String clientSecret;
    }
}
