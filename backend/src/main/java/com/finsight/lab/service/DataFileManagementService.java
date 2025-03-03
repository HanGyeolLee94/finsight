package com.finsight.lab.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.util.AuthUtil;

import jakarta.inject.Inject;

@Service
public class DataFileManagementService {

	private static final Logger logger = LoggerFactory.getLogger(DataFileManagementService.class);

	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "DataFileManagement.";

	// Inject UPLOAD_DIR from application.properties
	@Value("${file.upload.dir}")
	private String uploadDir;

	public Map<String, Object> uploadFile(Map<String, Object> param) {
		if (param == null || !param.containsKey("files") || !param.containsKey("actionType")) {
			throw new IllegalArgumentException("Missing required parameters: 'files' or 'actionType'.");
		}
		Map<String, Object> result = new HashMap<>();
		List<Map<String, String>> files = (List<Map<String, String>>) param.get("files");
		String actionType = (String) param.get("actionType");

		// Ensure the upload directory exists
		File uploadDirectory = new File(uploadDir);
		if (!uploadDirectory.exists()) {
			uploadDirectory.mkdirs();
		}

		try {
			for (Map<String, String> fileData : files) {
				String originalFileName = fileData.get("fileName");
				String fileContent = fileData.get("fileContent");

				// Generate a unique file name and ID
				String uniqueFileName = generateUniqueFileName(originalFileName);
				String uniqueId = UUID.randomUUID().toString();

				// Decode Base64 file content
				byte[] fileBytes = Base64.getDecoder().decode(fileContent);

				// Save the file
				File outputFile = new File(uploadDir + File.separator + uniqueFileName);
				try (FileOutputStream fos = new FileOutputStream(outputFile)) {
					fos.write(fileBytes);
				}

				// Save upload history to the database
				Map<String, Object> historyParam = new HashMap<>();
				historyParam.put("ID", uniqueId); // Add unique ID
				historyParam.put("FILE_NAME", originalFileName); // Use uppercase for column names
				historyParam.put("UNIQUE_FILE_NAME", uniqueFileName); // Use snake_case style
				historyParam.put("UPLOADED_BY", AuthUtil.getLoggedInUserId());
				historyParam.put("FILE_URL", "/files/" + uniqueFileName);
				historyParam.put("ACTION_TYPE", actionType);

				sqlSession.insert(NAMESPACE + "insertFileUploadHistory", historyParam);

				// Perform actionType-specific operations
				performActionTypeSpecificOperation(actionType, uniqueFileName, originalFileName);
			}

			logger.info("Files uploaded successfully with actionType: {}", actionType);
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (IOException e) {
			logger.error("Error saving files: {}", e.getMessage());
			throw new RuntimeException("Error saving files: " + e.getMessage());
		}
		return result;
	}

	private void performActionTypeSpecificOperation(String actionType, String uniqueFileName, String originalFileName) {
		switch (actionType) {
		case "snp500":
			processSnp500File(uniqueFileName);
			break;
		case "dowjones":
			processDowjonesFile(uniqueFileName);
			break;
		case "nasdaq100":
			processNasdaq100File(uniqueFileName);
		default:
			logger.warn("No specific actions defined for actionType: {}", actionType);
			break;
		}
	}

	private void processNasdaq100File(String uniqueFileName) {
		File file = new File(uploadDir + File.separator + uniqueFileName);

		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			// Step 1: Truncate the table
			sqlSession.update("DataFileManagement.truncateNasdaq100List");

			// Step 2: Read file and collect symbols
			List<String> symbols = new ArrayList<>();
			String line;
			while ((line = br.readLine()) != null) {
				String symbol = line.trim();
				if (!symbol.isEmpty()) {
					symbols.add(symbol);
				}
			}

			// Step 3: Batch insert symbols
			if (!symbols.isEmpty()) {
				Map<String, Object> param = new HashMap<>();
				param.put("symbols", symbols);
				sqlSession.insert("DataFileManagement.batchInsertNasdaq100List", param);
			}
		} catch (IOException e) {
			logger.error("Error processing S&P 500 file: {}", e.getMessage());
			throw new RuntimeException("Error processing S&P 500 file: " + e.getMessage());
		}
	}
	
	
	private void processDowjonesFile(String uniqueFileName) {
		File file = new File(uploadDir + File.separator + uniqueFileName);

		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			// Step 1: Truncate the table
			sqlSession.update("DataFileManagement.truncateDowjonesList");

			// Step 2: Read file and collect symbols
			List<String> symbols = new ArrayList<>();
			String line;
			while ((line = br.readLine()) != null) {
				String symbol = line.trim();
				if (!symbol.isEmpty()) {
					symbols.add(symbol);
				}
			}

			// Step 3: Batch insert symbols
			if (!symbols.isEmpty()) {
				Map<String, Object> param = new HashMap<>();
				param.put("symbols", symbols);
				sqlSession.insert("DataFileManagement.batchInsertDowjonesList", param);
			}
		} catch (IOException e) {
			logger.error("Error processing S&P 500 file: {}", e.getMessage());
			throw new RuntimeException("Error processing S&P 500 file: " + e.getMessage());
		}
	}
	
	private void processSnp500File(String uniqueFileName) {
		File file = new File(uploadDir + File.separator + uniqueFileName);

		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			// Step 1: Truncate the table
			sqlSession.update("DataFileManagement.truncateSnp500List");

			// Step 2: Read file and collect symbols
			List<String> symbols = new ArrayList<>();
			String line;
			while ((line = br.readLine()) != null) {
				String symbol = line.trim();
				if (!symbol.isEmpty()) {
					symbols.add(symbol);
				}
			}

			// Step 3: Batch insert symbols
			if (!symbols.isEmpty()) {
				Map<String, Object> param = new HashMap<>();
				param.put("symbols", symbols);
				sqlSession.insert("DataFileManagement.batchInsertSnp500List", param);
			}
		} catch (IOException e) {
			logger.error("Error processing S&P 500 file: {}", e.getMessage());
			throw new RuntimeException("Error processing S&P 500 file: " + e.getMessage());
		}
	}

	private String generateUniqueFileName(String originalFileName) {
		// Extract file extension
		int dotIndex = originalFileName.lastIndexOf(".");
		String baseName = (dotIndex == -1) ? originalFileName : originalFileName.substring(0, dotIndex);
		String extension = (dotIndex == -1) ? "" : originalFileName.substring(dotIndex);

		// Append a UUID to the file name
		return baseName + "_" + UUID.randomUUID() + extension;
	}

	public List<Map<String, Object>> getUploadHistory(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getFileUploadHistory", param);
	}

	public Map<String, Object> deleteHistory(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		@SuppressWarnings("unchecked")
		List<String> ids = (List<String>) param.get("ids");

		try {
			int deletedCount = sqlSession.delete(NAMESPACE + "deleteFileUploadHistory", ids);
			if (deletedCount > 0) {
				logger.info("Successfully deleted {} items from upload history.", deletedCount);
				result.put("STATUS", ResponseCode.SUCCESS);
				result.put("DELETED_COUNT", deletedCount);
			} else {
				result.put("STATUS", ResponseCode.ERROR);
				result.put("MESSAGE", "No items were deleted.");
			}
		} catch (Exception e) {
			logger.error("Error deleting upload history: {}", e.getMessage());
			result.put("STATUS", ResponseCode.ERROR);
			result.put("MESSAGE", "Failed to delete upload history.");
		}

		return result;
	}

	public ResponseEntity<Resource> downloadFile(String fileName) {
		try {
			Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists()) {
				return ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
						.body(resource);
			} else {
				throw new RuntimeException("File not found: " + fileName);
			}
		} catch (Exception ex) {
			throw new RuntimeException("Error while downloading file: " + ex.getMessage());
		}
	}
}
