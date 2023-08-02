package com.mmt.service;


import com.mmt.domain.response.ResponseDto;
import com.mmt.domain.response.my.MyBadgeRes;
import com.mmt.domain.response.my.MyLessonRes;
import com.mmt.domain.response.my.MyRecipeRes;
import com.mmt.domain.response.my.MyReviewRes;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MyService {

    List<MyLessonRes> getMyLesson(String userId, boolean isCompleted);
    List<MyRecipeRes> getMyRecipe(String userId);
    List<MyReviewRes> getMyReview(String userId);
    ResponseDto registerLicense(String userId, MultipartFile multipartFile);
    List<MyBadgeRes> getLicenseList(String userId);
    ResponseDto deleteProfileImg(String userId);
}