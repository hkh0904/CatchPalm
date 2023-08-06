package com.ssafy.catchpalm.api.response;

import com.ssafy.catchpalm.common.model.response.BaseResponseBody;
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
    private List<Rank> ranks;

    public static RankListPostRes of(Integer statusCode, String message, List<Rank> ranks) {
        RankListPostRes res = new RankListPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRanks(ranks);
        return res;
    }
}

