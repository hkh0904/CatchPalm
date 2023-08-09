package com.ssafy.catchpalm.db.repository;

import com.ssafy.catchpalm.db.entity.GameRoom;
import com.ssafy.catchpalm.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 게임 방 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface GameRoomRepository extends JpaRepository<GameRoom, Integer> {
    // 모든 GameRoom 엔티티 조회
    List<GameRoom> findAll();
}