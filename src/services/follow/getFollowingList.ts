import { Follower } from "../../entities/follower";

type getFollowingInput = {
    perPage: number,
    page: number,
    userId: string
}

export async function getFollowingList(followerDetails : getFollowingInput) {
    const {
        perPage,
        page,
        userId,
    } = followerDetails

    let queryBuilder =  Follower.createQueryBuilder("follower").where("follower.user = :user_id", { user_id: userId });
    queryBuilder.leftJoinAndSelect("follower.following", "users").orderBy("follower.created_time", "DESC")
    const totalRows = await queryBuilder.getCount()
    queryBuilder.offset(perPage * (page - 1)).limit(perPage)
    const following = await queryBuilder.getMany()
    return {
        following:  following,
        meta: {
            total_count: totalRows,
            per_page:perPage,
            page,
            count: following.length
        }
    };
}