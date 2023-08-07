package com.ssafy.catchpalm.api.response;

import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
import com.ssafy.catchpalm.db.dto.RankDTO;
import com.ssafy.catchpalm.db.entity.Rank;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("RankListPostResponse")
public class RankListPostRes extends BaseResponseBody {
    @ApiModelProperty(name="랭크 리스트")
    private List<RankDTO> ranks;
    private int userRanking;


    public static RankListPostRes of(Integer statusCode, String message, List<RankDTO> ranks, int userRanking) {
        RankListPostRes res = new RankListPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRanks(ranks);
        res.setUserRanking(userRanking);
        return res;
    }
}

