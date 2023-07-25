package com.mmt.domain.request;

import com.mmt.domain.entity.lesson.LessonCategory;
import com.mmt.domain.entity.lesson.LessonStep;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LessonPostReq {
    private int lessonId;
    private String lessonTitle;
    private String cookyerId;
    @Min(value = 1, message = "유효한 카테고리를 선택해주세요.")
    @Max(value = 7, message = "유효한 카테고리를 선택해주세요.")
    private int categoryId;
    private String description;
    private int maximum;
    private int price;
    private List<String> materials;
    private String lessonDate;
    private String videoUrl;
    private String thumbnailUrl;
    private List<LessonStep> lessonStepList;
}