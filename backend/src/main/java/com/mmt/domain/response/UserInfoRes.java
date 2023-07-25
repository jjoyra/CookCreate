package com.mmt.domain.response;

import com.mmt.domain.Role;
import com.mmt.domain.entity.Auth.Member;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserInfoRes {
    String userId;
    String nickname;
    String phoneNumber;
    String userEmail;
    String food;
    Role role;
    String introduce;
    String profileImg;
    String introUrl;
    LocalDateTime createdDate;

    public UserInfoRes(Member member) {
        this.userId = member.getUserId();
        this.nickname = member.getNickname();
        this.phoneNumber = member.getPhoneNumber();
        this.userEmail = member.getUserEmail();
        this.food = member.getFood();
        this.role = member.getRole();
        this.introduce = member.getIntroduce();
        this.profileImg = member.getProfileImg();
        this.introUrl = member.getIntroUrl();
        this.createdDate = member.getCreatedDate();
    }
}