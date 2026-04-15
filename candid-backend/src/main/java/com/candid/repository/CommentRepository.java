package com.candid.repository;

import com.candid.entity.Comment;
import com.candid.entity.Post;
import com.candid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
    List<Comment> findByPostAndParentIsNullOrderByCreatedAtAsc(Post post);
    List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);
    void deleteByParent(Comment parent);
    long countByPost(Post post);
    void deleteByPost(Post post);

    @Query("SELECT c.post.id, COUNT(c) FROM Comment c WHERE c.post IN :posts GROUP BY c.post.id")
    List<Object[]> countsByPosts(@Param("posts") List<Post> posts);

    @Query("SELECT c.post.user.id, COUNT(c) FROM Comment c WHERE c.user = :user GROUP BY c.post.user.id")
    List<Object[]> countCommentsByAuthor(@Param("user") User user);
}
