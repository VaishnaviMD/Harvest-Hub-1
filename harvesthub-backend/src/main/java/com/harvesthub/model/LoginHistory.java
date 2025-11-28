package com.harvesthub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_id")
    private Long loginId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private Users user;

    @Column(name = "email")
    private String email; // Store email for failed logins when user is null

    @Column(name = "login_date")
    private Date loginDate;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "login_status")
    private String loginStatus; // SUCCESS, FAILED

    @Column(name = "failure_reason")
    private String failureReason; // For failed logins
}

