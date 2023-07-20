package com.ssafy.catchpalm.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "CATEGORY")
@Getter
@Setter
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "category_number")
    private int categoryNumber;
    @Column(nullable = false)
    
    private int type;
    @Column(nullable = false)
    private int value;
    @Column(nullable = false)
    private String name;
}
