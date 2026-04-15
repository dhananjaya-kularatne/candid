package com.candid.repository;

import com.candid.entity.Notification;
import com.candid.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUserAndIsReadFalse(User user);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user")
    void markAllAsRead(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.post = :post")
    void deleteByPost(@Param("post") com.candid.entity.Post post);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId AND n.actor.id = :actorId AND n.type = :type")
    void deleteByUserAndActorAndType(@Param("userId") Long userId, @Param("actorId") Long actorId, @Param("type") Notification.Type type);
}
