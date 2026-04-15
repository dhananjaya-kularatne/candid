package com.candid.repository;

import com.candid.entity.FollowRequest;
import com.candid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {
    Optional<FollowRequest> findByRequesterAndTarget(User requester, User target);
    boolean existsByRequesterAndTargetAndStatus(User requester, User target, FollowRequest.Status status);
    List<FollowRequest> findByTargetAndStatus(User target, FollowRequest.Status status);
    void deleteByRequesterAndTarget(User requester, User target);
}
