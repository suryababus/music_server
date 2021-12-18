import { Follower } from "../../entities/follower";
import { User } from "../../entities/user";

export async function followUser(currentUserId : string , userId : string) {
    const following = await User.findOne({id:userId});
    if(following == undefined){
        throw new EvalError("Invalid Following user");
    }
    if(currentUserId == userId){
        throw new EvalError("Cannot follow yourself!.");
    }
    const existingData = await Follower.createQueryBuilder("follower").where("follower.user = :current_user_id AND follower.following = :follower_user_id ", { current_user_id: currentUserId, follower_user_id : userId }).getMany();
    if(existingData.length > 0){
        throw new EvalError("You are already following the same person");
    }
    const follower = Follower.create({
        user: await User.findOne({id:currentUserId}),
        following: following,
    });
    console.log(follower)
    return await follower.save();
}