package com.candid.service;

import com.candid.dto.UserResponse;
import com.candid.entity.FollowRequest;
import com.candid.entity.User;
import com.candid.repository.FollowRepository;
import com.candid.repository.FollowRequestRepository;
import com.candid.repository.PostRepository;
import com.candid.repository.UserRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final FollowRequestRepository followRequestRepository;
    private final PostRepository postRepository;
    private final Cloudinary cloudinary;

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapToResponse(user, null);
    }

    public UserResponse getUserByUsername(String username, User currentUser) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user, currentUser);
    }

    public UserResponse updateProfile(String email, String name, String bio, Boolean isPrivate,
                                      MultipartFile avatarFile, MultipartFile bannerFile) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (name != null && !name.isBlank()) user.setName(name);
        if (bio != null) user.setBio(bio);
        if (isPrivate != null) user.setPrivate(isPrivate);

        if (avatarFile != null && !avatarFile.isEmpty()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(avatarFile.getBytes(),
                    Map.of("folder", "candid/avatars", "public_id", "user_" + user.getId()));
            user.setAvatarUrl((String) uploadResult.get("secure_url"));
        }

        if (bannerFile != null && !bannerFile.isEmpty()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(bannerFile.getBytes(),
                    Map.of("folder", "candid/banners", "public_id", "banner_" + user.getId()));
            user.setBannerUrl((String) uploadResult.get("secure_url"));
        }

        userRepository.save(user);
        return mapToResponse(user, user);
    }

    public Page<UserResponse> searchUsers(String query, User currentUser, Pageable pageable) {
        Page<User> users = userRepository
                .findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query, pageable);
        List<UserResponse> responses = users.getContent().stream()
                .map(u -> mapToResponse(u, currentUser))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, users.getTotalElements());
    }

    public List<UserResponse> getSuggestedUsers(User currentUser, Pageable pageable) {
        List<User> following = followRepository.findByFollower(currentUser)
                .stream().map(f -> f.getFollowing()).collect(Collectors.toList());
        following.add(currentUser);

        return userRepository.findAll(pageable).getContent().stream()
                .filter(u -> !following.contains(u))
                .limit(5)
                .map(u -> mapToResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public UserResponse mapToResponse(User user, User currentUser) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setBannerUrl(user.getBannerUrl());
        response.setRole(user.getRole().name());
        response.setStatus(user.getStatus().name());
        response.setCreatedAt(user.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant());
        response.setPrivateProfile(user.isPrivate());
        response.setFollowersCount(followRepository.countByFollowing(user));
        response.setFollowingCount(followRepository.countByFollower(user));
        response.setPostsCount(postRepository.countByUser(user));
        if (currentUser != null && !currentUser.getId().equals(user.getId())) {
            response.setFollowing(followRepository.existsByFollowerAndFollowing(currentUser, user));
            response.setFollowRequestSent(followRequestRepository.existsByRequesterAndTargetAndStatus(
                    currentUser, user, FollowRequest.Status.PENDING));
        }
        return response;
    }

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
