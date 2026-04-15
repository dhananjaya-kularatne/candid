package com.candid.repository;

import com.candid.entity.Bookmark;
import com.candid.entity.Post;
import com.candid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    List<Bookmark> findByUserOrderByCreatedAtDesc(User user);
    void deleteByUserAndPost(User user, Post post);
    void deleteByPost(Post post);

    @Query("SELECT b.post.id FROM Bookmark b WHERE b.user = :user AND b.post IN :posts")
    List<Long> bookmarkedPostIds(@Param("user") User user, @Param("posts") List<Post> posts);

    @Query("SELECT b.post.user.id, COUNT(b) FROM Bookmark b WHERE b.user = :user GROUP BY b.post.user.id")
    List<Object[]> countBookmarksByAuthor(@Param("user") User user);
}
