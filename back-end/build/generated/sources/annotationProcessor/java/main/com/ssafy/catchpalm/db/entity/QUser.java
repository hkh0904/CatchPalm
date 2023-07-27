package com.ssafy.catchpalm.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -439282322L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final NumberPath<Integer> age = createNumber("age", Integer.class);

    public final StringPath emailVerificationToken = createString("emailVerificationToken");

    public final NumberPath<Integer> emailVerified = createNumber("emailVerified", Integer.class);

    public final QGameRoom gameRoom;

    public final DateTimePath<java.time.LocalDateTime> joinDate = createDateTime("joinDate", java.time.LocalDateTime.class);

    public final ListPath<MusicLike, QMusicLike> likeList = this.<MusicLike, QMusicLike>createList("likeList", MusicLike.class, QMusicLike.class, PathInits.DIRECT2);

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final NumberPath<Integer> point = createNumber("point", Integer.class);

    public final SimplePath<java.sql.Blob> profileImg = createSimple("profileImg", java.sql.Blob.class);

    public final SimplePath<java.sql.Blob> profileMusic = createSimple("profileMusic", java.sql.Blob.class);

    public final QRank rank;

    public final StringPath refreshToken = createString("refreshToken");

    public final NumberPath<Integer> sex = createNumber("sex", Integer.class);

    public final NumberPath<Integer> status = createNumber("status", Integer.class);

    public final NumberPath<Double> synk = createNumber("synk", Double.class);

    public final StringPath userId = createString("userId");

    public final NumberPath<Long> userNumber = createNumber("userNumber", Long.class);

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.gameRoom = inits.isInitialized("gameRoom") ? new QGameRoom(forProperty("gameRoom"), inits.get("gameRoom")) : null;
        this.rank = inits.isInitialized("rank") ? new QRank(forProperty("rank"), inits.get("rank")) : null;
    }

}

