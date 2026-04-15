package com.candid.repository;

import com.candid.entity.Hashtag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByName(String name);
    List<Hashtag> findByTrendingTrue();
    Page<Hashtag> findAllByOrderByNameAsc(Pageable pageable);

    /** Top hashtags by number of posts in the given time window, returned as [Hashtag, count] pairs */
    @Query("SELECT h, COUNT(p) FROM Post p JOIN p.hashtags h WHERE p.createdAt >= :since GROUP BY h ORDER BY COUNT(p) DESC")
    List<Object[]> findTopSince(@Param("since") LocalDateTime since, Pageable pageable);

    /** Top hashtags of all time as fallback, returned as [Hashtag, count] pairs */
    @Query("SELECT h, COUNT(p) FROM Post p JOIN p.hashtags h GROUP BY h ORDER BY COUNT(p) DESC")
    List<Object[]> findTopAllTime(Pageable pageable);
}
