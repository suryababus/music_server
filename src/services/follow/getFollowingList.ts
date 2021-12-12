import { Follower } from "../../entities/follower";

type getFollowingInput = {
    perPage: number,
    page: number,
    userId: string
}

export async function getFollowingList(followerDetails: getFollowingInput) {
    const {
        perPage,
        page,
        userId,
    } = followerDetails

    let queryBuilder = Follower.createQueryBuilder("follower").where("follower.user = :user_id", { user_id: userId });
    queryBuilder.leftJoinAndSelect("follower.following", "user")
        .orderBy("follower.created_time", "DESC")
        .select(['user.id as id', 'user.name as name', 'user.email as email'])
    const totalRows = await queryBuilder.getCount()
    queryBuilder.offset(perPage * (page - 1)).limit(perPage)
    const following = await queryBuilder.getRawMany()
    return {
        following: following,
        meta: {
            total_count: totalRows,
            per_page: perPage,
            page,
            count: following.length
        }
    };
}