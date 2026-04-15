package com.candid.service;

import com.candid.dto.UserResponse;
import com.candid.entity.Follow;
import com.candid.entity.FollowRequest;
import com.candid.entity.Notification;
import com.candid.entity.User;
import com.candid.repository.FollowRepository;
import com.candid.repository.FollowRequestRepository;
import com.candid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final FollowRequestRepository followRequestRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    /** Returns "following", "requested", or "already_following" */
    @Transactional
    public String follow(String followerEmail, String targetUsername) {
        User follower = userService.getUserEntityByEmail(followerEmail);
        User following = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (follower.getId().equals(following.getId())) {
            throw new RuntimeException("Cannot follow yourself");
        }

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            return "already_following";
        }

        if (following.isPrivate()) {
            if (!followRequestRepository.existsByRequesterAndTargetAndStatus(
                    follower, following, FollowRequest.Status.PENDING)) {
                FollowRequest req = new FollowRequest();
                req.setRequester(follower);
                req.setTarget(following);
                followRequestRepository.save(req);
                // Remove any stale request notification from a previous follow/unfollow cycle
                notificationService.deleteExisting(following, follower, Notification.Type.FOLLOW_REQUEST);
                notificationService.create(following, follower, Notification.Type.FOLLOW_REQUEST, null, null);
            }
            return "requested";
        } else {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);
            followRepository.save(follow);
            notificationService.create(following, follower, Notification.Type.FOLLOW, null, null);
            return "following";
        }
    }

    @Transactional
    public void unfollow(String followerEmail, String targetUsername) {
        User follower = userService.getUserEntityByEmail(followerEmail);
        User following = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        followRepository.deleteByFollowerAndFollowing(follower, following);
        // Also cancel any pending follow request
        followRequestRepository.deleteByRequesterAndTarget(follower, following);
    }

    @Transactional
    public void acceptRequest(String currentUserEmail, String requesterUsername) {
        User target = userService.getUserEntityByEmail(currentUserEmail);
        User requester = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<FollowRequest> requestOpt = followRequestRepository.findByRequesterAndTarget(requester, target);

        // Create the follow only if it doesn't already exist (idempotent)
        if (!followRepository.existsByFollowerAndFollowing(requester, target)) {
            Follow follow = new Follow();
            follow.setFollower(requester);
            follow.setFollowing(target);
            followRepository.save(follow);
            notificationService.create(requester, target, Notification.Type.FOLLOW_ACCEPTED, null, null);
        }

        // Delete the request if it exists
        requestOpt.ifPresent(followRequestRepository::delete);

        // Always ensure the notification is deleted so it doesn't stay in the activity feed
        notificationService.deleteExisting(target, requester, Notification.Type.FOLLOW_REQUEST);
    }

    @Transactional
    public void declineRequest(String currentUserEmail, String requesterUsername) {
        User target = userService.getUserEntityByEmail(currentUserEmail);
        User requester = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        followRequestRepository.findByRequesterAndTarget(requester, target)
                .ifPresent(followRequestRepository::delete);

        // Always ensure the notification is deleted so it doesn't stay in the activity feed
        notificationService.deleteExisting(target, requester, Notification.Type.FOLLOW_REQUEST);
    }

    public List<UserResponse> getFollowers(String username, User currentUser) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.findByFollowing(user).stream()
                .map(f -> userService.mapToResponse(f.getFollower(), currentUser))
                .collect(Collectors.toList());
    }

    public List<UserResponse> getFollowing(String username, User currentUser) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return followRepository.findByFollower(user).stream()
                .map(f -> userService.mapToResponse(f.getFollowing(), currentUser))
                .collect(Collectors.toList());
    }
}
