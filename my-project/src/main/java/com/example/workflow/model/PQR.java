package com.example.workflow.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class PQR {
    private UUID id;
    private String pqr;
    private String description;
    private String clientName;
    private String clientLastName;
    private Long clientPhone;
    private String pqrType;
    private String email;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime progationDate;
    private Boolean isProcessed;

    public Map<String, Object> toMap() {
        LocalDateTime date = LocalDateTime.now();
        Map<String, Object> map = new HashMap<>();
        UUID id = getId() == null ? UUID.randomUUID() : getId();
        map.put("id", id.toString());
        map.put("pqr",          pqr != null ? pqr : "");
        map.put("description",  description != null ? description : "");
        map.put("client_name",   clientName != null ? clientName : "");
        map.put("client_last_name", clientLastName != null ? clientLastName : "");
        map.put("client_phone",  clientPhone != null ? clientPhone : 0L);
        map.put("pqr_type",      pqrType != null ? pqrType : "DESCONOCIDO");
        map.put("client_email",        email != null ? email : "");
        map.put("date",         progationDate != null ? progationDate : date);
        map.put("is_processed",  isProcessed != null ? isProcessed : false);
        System.out.println("map:"+map);
        return map;
    }

    public static PQR fromMap(Map<String, Object> map) {
        // ✅ Fix clientPhone — Integer → Long
        Number clientPhoneNum = (Number) map.get("client_phone");
        Long clientPhone = clientPhoneNum != null ? clientPhoneNum.longValue() : null;

        // ✅ Fix date — String → LocalDateTime
        LocalDateTime date = null;
        Object rawDate = map.get("date");
        if (rawDate instanceof String) {
            date = LocalDateTime.parse((String) rawDate);
        } else if (rawDate instanceof LocalDateTime) {
            date = (LocalDateTime) rawDate;
        }
        String id = (String) map.get("id");
        UUID uuid = UUID.fromString(id);
        return PQR.builder()
                .id(uuid)
                .pqr((String) map.get("pqr"))
                .description((String) map.get("description"))
                .clientName((String) map.get("client_name"))
                .clientLastName((String) map.get("client_last_ame"))
                .clientPhone(clientPhone)
                .progationDate(date)
                .email((String) map.get("client_email"))
                .pqrType((String) map.get("pqr_type"))
                .isProcessed((Boolean) map.get("is_processed"))
                .build();
    }
}
