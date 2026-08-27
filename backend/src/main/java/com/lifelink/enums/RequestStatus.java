package com.lifelink.enums;

/**
 * Status lifecycle for blood requests.
 * Flow: PENDING -> ACCEPTED/REJECTED -> COMPLETED
 */
public enum RequestStatus {
    PENDING,
    MATCHED,
    ACCEPTED,
    FULFILLED,
    REJECTED,
    CANCELLED,
    EXPIRED,
    COMPLETED
}

