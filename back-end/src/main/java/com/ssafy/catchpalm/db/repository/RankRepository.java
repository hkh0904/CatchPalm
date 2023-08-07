package com.ssafy.catchpalm.db.repository;


import com.ssafy.catchpalm.db.entity.Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RankRepository extends JpaRepository<Rank, Integer> {

}
