// src/main/java/com/ems/ems_backend/utils/EmployeeIdGenerator.java
package com.ems.ems_backend.utils;

import java.security.SecureRandom;

public class EmployeeIdGenerator {
    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom rnd = new SecureRandom();
    private static final int TOTAL_LENGTH = 10;

    /**
     * Generate a 10-char ID:
     *  – 1st char: first letter of name (or 'X')
     *  – 2nd char: first letter of department (or 'X')
     *  – remaining 8 chars: random A–Z0–9
     */
    public static String generateId(String name, String department) {
        char nameInitial = (name != null && !name.isEmpty())
                ? Character.toUpperCase(name.charAt(0))
                : 'X';
        char deptInitial = (department != null && !department.isEmpty())
                ? Character.toUpperCase(department.charAt(0))
                : 'X';

        StringBuilder sb = new StringBuilder(TOTAL_LENGTH);
        sb.append(nameInitial).append(deptInitial);

        for (int i = 2; i < TOTAL_LENGTH; i++) {
            sb.append(ALPHANUM.charAt(rnd.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }
}
