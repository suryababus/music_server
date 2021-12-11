import { Song } from "../../entities/song"

export async function getLikedSongsData(roomId :string, perPage : number, page : number) {
    var songsData : Song[];
    if(roomId != undefined){
        songsData = await Song.createQueryBuilder("song").where("song.room = :room_id", { room_id: roomId }).orderBy("song.added_time", "ASC").getMany();
    }else{
        songsData = await Song.createQueryBuilder("song").orderBy("song.added_time", "ASC").getMany();
    }
    var startIndex : number;
    var endIndex : number;
    if( page == 1){
        startIndex = 0;
        endIndex = perPage;
    }else{
        startIndex = perPage * (page - 1) ;
        endIndex = perPage * page;
    }
    var sortedSongsList: Song[] = [];
    for( var i = startIndex ; i < endIndex && i < songsData.length ; i++){
        sortedSongsList.push(songsData[i]);
    }
    return sortedSongsList;
}