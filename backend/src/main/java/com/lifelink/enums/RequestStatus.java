package com.lifelink.enums;

/**
 * Status lifecycle for blood requests.
 * Flow: PENDING -> ACCEPTED/REJECTED -> COMPLETED
 */
public enum RequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    COMPLETED
}
