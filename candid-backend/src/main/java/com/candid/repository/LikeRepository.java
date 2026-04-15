package com.candid.repository;

import com.candid.entity.Like;
import com.candid.entity.Post;
import com.candid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    long countByPost(Post post);
    void deleteByUserAndPost(User user, Post post);
    void deleteByPost(Post post);

    @Query("SELECT l.post.id, COUNT(l) FROM Like l WHERE l.post IN :posts GROUP BY l.post.id")
    List<Object[]> countsByPosts(@Param("posts") List<Post> posts);

    @Query("SELECT l.post.id FROM Like l WHERE l.user = :user AND l.post IN :posts")
    List<Long> likedPostIds(@Param("user") User user, @Param("posts") List<Post> posts);

    @Query("SELECT l.post.user.id, COUNT(l) FROM Like l WHERE l.user = :user GROUP BY l.post.user.id")
    List<Object[]> countLikesByAuthor(@Param("user") User user);

    @Query("SELECT DISTINCT l.post.id FROM Like l WHERE l.user IN (SELECT f.following FROM Follow f WHERE f.follower = :user)")
    List<Long> findPostIdsLikedByFollowing(@Param("user") User user);
}
