package com.finsight.lab.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.model.CustomUserDetails;
import com.finsight.lab.util.AuthUtil;
import com.finsight.lab.util.JwtUtil;
import com.finsight.lab.util.PasswordUtil;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class AuthService {

	@Autowired
	private SqlSession sqlSession;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private JavaMailSender mailSender;

	private static final String NAMESPACE = "Auth.";

	// User authentication
	public Map<String, Object> authenticate(String email, String rawPassword) {
		Map<String, Object> param = Map.of("email", email);

		// Retrieve user details from the database
		Map<String, Object> userDetails = sqlSession.selectOne(NAMESPACE + "getUserDetailsByEmail", param);

		// If no user is found, return null
		if (userDetails == null) {
			return null;
		}

		// Extract hashed password from the result
		String hashedPassword = (String) userDetails.get("PASSWORD_HASH");
		
		// Compare raw password with hashed password using BCrypt
		if (PasswordUtil.verifyPassword(rawPassword, hashedPassword)) {
			return userDetails; // Return user details if authentication succeeds
		}

		return null; // Return null if authentication fails
	}

	// Get user menu permissions based on their role
	public List<Map<String, Object>> getMenuPermissions(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "findMenuPermissionsByEmail", param);
	}

	// Retrieve user's default page
	public String getDefaultPagePath(String email) {
		return sqlSession.selectOne("UserInfoMapper.getDefaultPagePath", email);
	}

	// Login logic with Map parameter and defaultPage
	public Map<String, Object> login(Map<String, Object> param) {
		String email = (String) param.get("email");
		String password = (String) param.get("password");

		Map<String, Object> response = new HashMap<>();

		// Authenticate the user and retrieve user details
		Map<String, Object> userDetails = authenticate(email, password);

		if (userDetails != null) {
			// Generate JWT
			String userId = String.valueOf(userDetails.get("USER_ID"));
			String roleId = (String)userDetails.get("ROLE_ID");
			
			String token = jwtUtil.generateToken(email, userId);
			// Retrieve default page path
			String defaultPagePath = getDefaultPagePath(email);

			// Extract necessary fields from userDetails and add to response
			response.put("token", token);
			response.put("defaultPagePath", defaultPagePath);
			response.put("username", userDetails.get("USERNAME")); // Add username
			response.put("email", userDetails.get("EMAIL")); // Add email
			response.put("pwResetRequired", userDetails.get("PASSWORD_RESET_REQUIRED")); // Add email
			
		} else {
			response.put("error", "Invalid email or password");
		}

		return response;
	}

	// Retrieve all users
	public List<Map<String, Object>> getAllUsers(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "findAll", param);
	}

	public Map<String, Object> signUp(Map<String, Object> userRequest) {
		String email = (String) userRequest.get("email");
		String password = (String) userRequest.get("password");
		String username = (String) userRequest.get("username");

		Map<String, Object> response = new HashMap<>();

		// 이메일 중복 체크
		Integer existingUserCount = sqlSession.selectOne(NAMESPACE + "checkUserByEmail", email);
		if (existingUserCount != null && existingUserCount > 0) {
			response.put("error", "Email is already registered");
			return response;
		}

		// 비밀번호 해싱
		String hashedPassword = PasswordUtil.hashPassword(password);

		// 사용자 생성
		Map<String, Object> newUser = Map.of("username", username, "email", email, "passwordHash", hashedPassword, // 해싱된
																													// 비밀번호
																													// 저장
				"roleId", "admin", // 기본 권한
				"useYn", "Y" // 활성 상태
		);

		int rowsInserted = sqlSession.insert(NAMESPACE + "insertUser", newUser);

		if (rowsInserted > 0) {
			response.put("message", "User registered successfully");
		} else {
			response.put("error", "Failed to register user");
		}

		return response;
	}

	// Send an email with the new password
	private void sendEmail(String toEmail, String newPassword) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setTo(toEmail);
		helper.setSubject("Your New Temporary Password");
		helper.setText("<p>Your new password is:</p><h3>" + newPassword + "</h3>", true);
		mailSender.send(message);
	}

	private void updatePassword(String email, String newPassword, String pwResetRequired) {
		String hashedPassword = PasswordUtil.hashPassword(newPassword);
		Map<String, Object> param = Map.of("email", email, "passwordHash", hashedPassword, "PASSWORD_RESET_REQUIRED", pwResetRequired);
		int rowsUpdated = sqlSession.update(NAMESPACE + "updatePassword", param);

		if (rowsUpdated == 0) {
			throw new IllegalArgumentException("No account found for the provided email: " + email);
		}
	}

	private boolean emailExists(String email) {
		Integer count = sqlSession.selectOne(NAMESPACE + "checkEmailExists", Map.of("email", email));
		return count != null && count > 0;
	}

	public Map<String, Object> resetPasswordAndNotify(Map<String, String> param) {
		Map<String, Object> result = new HashMap<>();
		String email = param.get("email");

		// Step 1: Validate the email exists
		if (!emailExists(email)) {
			result.put("STATUS", ResponseCode.ERROR);
			result.put("MESSAGE", "The email address is not registered.");
			return result;
		}

		// Step 2: Generate a new random password
		String newPassword = PasswordUtil.generateRandomPassword();

		// Step 3: Update the password in the database
		updatePassword(email, newPassword, "Y");

		// Step 4: Send email with the new password
		try {
			sendEmail(email, newPassword);
		} catch (MessagingException e) {
			e.printStackTrace();
			result.put("STATUS", ResponseCode.ERROR);
			result.put("MESSAGE", "Failed to send email.");
			return result;
		}

		result.put("STATUS", ResponseCode.SUCCESS);
		result.put("MESSAGE", "A temporary password has been sent to your email.");
		return result;
	}
	
	public Map<String, Object> changePassword(Map<String, Object> userRequest) {
		
		String email = (String) userRequest.get("email");
		String password = (String) userRequest.get("password");

		// 사용자 생성
		updatePassword(email, password, "N");
		
		return this.login(userRequest);
	}
}
