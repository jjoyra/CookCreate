package com.mmt.common.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mmt.domain.response.ResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    // 클라이언트가 요청을 보내면 딱한번 실행이됨.
    // 클라이언트가 header에 토큰값을 실어보내면
    // doFilterInternal안에서 토큰검증후 인증객체 생성후
    // Security Context에 정보 저장

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    // HTTP 요청이 오면 WAS(tomcat)가 HttpServletRequest, HttpServletResponse 객체를 만들어 줍니다.
    // 만든 인자 값을 받아옵니다.
    // 요청이 들어오면 diFilterInternal 이 딱 한번 실행된다.
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // WebSecurityConfig 에서 보았던 UsernamePasswordAuthenticationFilter 보다 먼저 동작을 하게 됩니다.

        // Access / Refresh 헤더에서 토큰을 가져옴.
        String accessToken = jwtUtil.getHeaderToken(request, "Access");
        String refreshToken = jwtUtil.getHeaderToken(request, "Refresh");

        if(accessToken != null) {
            // 어세스 토큰값이 유효하다면 setAuthentication를 통해
            // security context에 인증 정보저장
            if(jwtUtil.tokenValidation(accessToken)){
                // access token이 blacklist에 저장되어 있는지 확인
                String isLogout = (String) redisTemplate.opsForValue().get(accessToken);
                if(ObjectUtils.isEmpty(isLogout)){
                    // 토큰이 유효할 경우 토큰에서 userid 가져와서 authentication 세팅
                    setAuthentication(jwtUtil.getUserIdFromToken(accessToken));
                }
            }
//            else if (refreshToken != null) { // 어세스 토큰이 만료된 상황 && 리프레시 토큰 또한 존재하는 상황
//                // 리프레시 토큰 검증 && 리프레시 토큰 DB에서  토큰 존재유무 확인
//                boolean isRefreshToken = jwtUtil.refreshTokenValidation(refreshToken);
//                // -> redis로 수정
////                String isRefreshToken = (String) redisTemplate.opsForValue().get()
//                // 리프레시 토큰이 유효하고 리프레시 토큰이 DB와 비교했을때 똑같다면
//                if (isRefreshToken) {
//                    // 리프레시 토큰으로 아이디 정보 가져오기
//                    String loginId = jwtUtil.getUserIdFromToken(refreshToken);
//                    // 새로운 어세스 토큰 발급
//                    String newAccessToken = jwtUtil.createToken(loginId, "Access");
//                    // 헤더에 어세스 토큰 추가
//                    jwtUtil.setHeaderAccessToken(response, newAccessToken);
//                    // Security context에 인증 정보 넣기
//                    setAuthentication(jwtUtil.getUserIdFromToken(newAccessToken));
//                } else { // 리프레시 토큰이 만료 || 리프레시 토큰이 DB와 비교했을때 똑같지 않다면
//                    jwtExceptionHandler(response, "재로그인 후 이용해주세요.", HttpStatus.UNAUTHORIZED);
//                    return;
//                }
//            } else {
//                jwtExceptionHandler(response, "재로그인 후 이용해주세요.", HttpStatus.UNAUTHORIZED);
//                return;
//            }
        }

        filterChain.doFilter(request,response);
    }

    // SecurityContext 에 Authentication 객체를 저장합니다.
    public void setAuthentication(String email) {
        Authentication authentication = jwtUtil.createAuthentication(email);
        // security가 만들어주는 securityContextHolder 그 안에 authentication을 넣어줍니다.
        // security가 securitycontextholder에서 인증 객체를 확인하는데
        // jwtAuthfilter에서 authentication을 넣어주면 UsernamePasswordAuthenticationFilter 내부에서 인증이 된 것을 확인하고 추가적인 작업을 진행하지 않습니다.
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // Jwt 예외처리
    public void jwtExceptionHandler(HttpServletResponse response, String msg, HttpStatus status) {
        response.setStatus(status.value());
        response.setContentType("application/json");
        try {
            String json = new ObjectMapper().writeValueAsString(new ResponseDto(status, msg));
            response.getWriter().write(json);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }


}
