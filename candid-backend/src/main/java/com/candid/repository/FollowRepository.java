package com.candid.repository;

import com.candid.entity.Follow;
import com.candid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    boolean existsByFollowerAndFollowing(User follower, User following);
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowing(User following);
    long countByFollowing(User user);
    long countByFollower(User user);
    void deleteByFollowerAndFollowing(User follower, User following);
}
