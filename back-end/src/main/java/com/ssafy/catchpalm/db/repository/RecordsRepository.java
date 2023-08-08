package com.ssafy.catchpalm.db.repository;
import com.ssafy.catchpalm.db.entity.Records;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordsRepository extends JpaRepository<Records, Integer> {

}
