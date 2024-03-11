package com.unlockestate.ueparent.file.repository;

import com.unlockestate.ueparent.file.dto.Image;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    @Modifying
    @Transactional
    @Query(value = "update image set link = ?1 where id = ?2", nativeQuery = true)
    void setLink(String link, Integer imageId);
}
