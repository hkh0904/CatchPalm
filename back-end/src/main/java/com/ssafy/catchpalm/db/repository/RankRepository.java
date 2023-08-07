package com.ssafy.catchpalm.db.repository;


import com.ssafy.catchpalm.db.entity.Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankRepository extends JpaRepository<Rank, Integer> {

    Optional<Rank> findByRankUserUserNumberAndMusicMusicNumber(long userNumber, int musicNumber);
    List<Rank> findByMusicMusicNumberOrderByScoreDesc(int musicNumber);

}
