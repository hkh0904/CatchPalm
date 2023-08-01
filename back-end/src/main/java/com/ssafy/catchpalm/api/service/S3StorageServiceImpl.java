package com.ssafy.catchpalm.api.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class S3StorageServiceImpl implements StorageService {
    private final AmazonS3 s3Client;
    private final String bucketName;

    public S3StorageServiceImpl(AmazonS3 s3Client) {
        this.s3Client = s3Client;
        this.bucketName = "your-bucket-name";
    }

    @Override
    public void store(MultipartFile file) {
        try {
            s3Client.putObject(new PutObjectRequest(bucketName, file.getOriginalFilename(), file.getInputStream(), null));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public Resource load(String filename) {
        try {
            InputStream is = s3Client.getObject(bucketName, filename).getObjectContent();
            return new InputStreamResource(is);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load file " + filename, e);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            s3Client.deleteObject(new DeleteObjectRequest(bucketName, filename));
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file " + filename, e);
        }
    }
}