import { Reaction } from "../../entities/reaction"

type getLikedSongsInput = {
    roomId?: string,
    perPage: number,
    page: number,
    userId: string
}

export async function getLikedSongsData(input: getLikedSongsInput) {
    const {
        roomId,
        perPage,
        page,
        userId,
    } = input
    let queryBuilder = Reaction.createQueryBuilder("reaction")
    if (roomId !== undefined) {
        queryBuilder.where(`reaction.searchkey like '%${roomId}%'`);
    }
    queryBuilder.andWhere(`reaction.searchkey like '%${userId}%'`)
    queryBuilder.orderBy("reaction.created_time", "DESC")
    const totalRows = await queryBuilder.getCount()
    queryBuilder.offset(perPage * (page - 1)).limit(perPage)
    const likedSongs = await queryBuilder.getMany()
    return {
        songs:  likedSongs,
        meta: {
            total_count: totalRows,
            per_page:perPage,
            page,
            count: likedSongs.length
        }
    };
}