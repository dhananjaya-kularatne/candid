package com.candid.repository;

import com.candid.entity.Post;
import com.candid.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT p FROM Post p WHERE p.user IN :users ORDER BY p.createdAt DESC")
    Page<Post> findFeedPosts(@Param("users") List<User> users, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user <> :currentUser AND p.user.isPrivate = false ORDER BY p.createdAt DESC")
    List<Post> findDiscoverPool(@Param("currentUser") User currentUser, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.isPrivate = false ORDER BY p.createdAt DESC")
    Page<Post> findPublicFeed(Pageable pageable);


    @Query("SELECT p FROM Post p WHERE p.user.isPrivate = false ORDER BY p.createdAt DESC")
    Page<Post> findPublicPosts(Pageable pageable);

    long countByCreatedAtAfter(LocalDateTime dateTime);

    @Query(value = "SELECT COUNT(*) FROM posts WHERE created_at > NOW() - INTERVAL 1 DAY", nativeQuery = true)
    long countPostsToday();

    Page<Post> findByContentContainingIgnoreCase(String query, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE h.name = :tag AND p.user.isPrivate = false ORDER BY p.id DESC")
    Page<Post> findByHashtag(@Param("tag") String tag, Pageable pageable);

    long countByUser(User user);

    Page<Post> findByMood(String mood, Pageable pageable);
}
