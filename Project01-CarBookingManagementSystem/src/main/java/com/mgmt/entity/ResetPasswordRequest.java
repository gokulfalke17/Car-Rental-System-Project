package com.mgmt.entity;

import lombok.Data;

@Data
public class ResetPasswordRequest {
	private String email;
    private String newPassword;
}
