package com.finsight.lab.constants;

public enum ResponseCode {
    SUCCESS("200", "Success"),
    ERROR("500", "Error");

    private final String code;
    private final String message;

    ResponseCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
