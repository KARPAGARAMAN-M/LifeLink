package com.lifelink.enums;

/**
 * Blood group types supported by the system.
 */
public enum BloodGroup {
    A_POSITIVE("A+"),
    A_NEGATIVE("A-"),
    B_POSITIVE("B+"),
    B_NEGATIVE("B-"),
    AB_POSITIVE("AB+"),
    AB_NEGATIVE("AB-"),
    O_POSITIVE("O+"),
    O_NEGATIVE("O-");

    private final String displayName;

    BloodGroup(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Parse blood group from display name string (e.g., "A+", "O-").
     */
    public static BloodGroup fromDisplayName(String displayName) {
        for (BloodGroup bg : values()) {
            if (bg.displayName.equals(displayName)) {
                return bg;
            }
        }
        throw new IllegalArgumentException("Unknown blood group: " + displayName);
    }
}
