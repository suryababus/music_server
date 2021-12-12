import { Follower } from "../../entities/follower";

type getFollowesInput = {
    perPage: number,
    page: number,
    userId: string
}

export async function getFollowersList(followerDetails: getFollowesInput) {
    const {
        perPage,
        page,
        userId,
    } = followerDetails
    console.log(userId)
    let queryBuilder = Follower.createQueryBuilder("follower").where("follower.following = :user_id", { user_id: userId });
    queryBuilder.leftJoinAndSelect("follower.user", "user")
        .orderBy("follower.created_time", "DESC")
        .select(['user.id as id', 'user.name as name', 'user.email as email'])
    const totalRows = await queryBuilder.getCount()
    queryBuilder.offset(perPage * (page - 1)).limit(perPage)
    const followers = await queryBuilder.getRawMany()
    return {
        followers: followers,
        meta: {
            total_count: totalRows,
            per_page: perPage,
            page,
            count: followers.length
        }
    };
}