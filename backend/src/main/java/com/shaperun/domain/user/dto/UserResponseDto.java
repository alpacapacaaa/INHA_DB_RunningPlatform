package com.shaperun.domain.user.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

public class UserResponseDto {

    @Getter
    @Builder
    public static class SigninResponse {

        private String token;
        private String userId;
    }

    @Getter
    @Builder
    public static class ProfileResponse {

        private String userName;
        private String userLevel;
        private List<RecentRunRecord> recentlyRecords;
    }

    @Getter
    @Builder
    public static class RecentRunRecord {

        private String id;
        private String courseId;
        private String courseName;
        private String date;
        private String startTime;
        private float distance;
        private int duration;
        private float averagePace;
        private float fastestPace;
        private List<Float> segmentPaces;
        private int calories;
        private String district;
        private String reviewSummary;
    }
}
