package com.finsight.lab.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.finsight.lab.model.CustomUserDetails;

public class AuthUtil {
	public static String getLoggedInUserId() {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    if (auth != null) {
	        System.out.println("Authentication found: " + auth);
	        System.out.println("Principal type: " + auth.getPrincipal().getClass().getName());
	        if (auth.isAuthenticated() && auth.getPrincipal() instanceof CustomUserDetails) {
	            return ((CustomUserDetails) auth.getPrincipal()).getUserId();
	        }
	    }
	    return null;
	}

}
