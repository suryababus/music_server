import { Follower } from "../../entities/follower";
import { User } from "../../entities/user";

export async function followUser(currentUserId : string , userId : string) {
    const following = await User.findOne({id:userId});
    if(following == undefined){
        throw new EvalError("Invalid Following user");
    }
   const follower = Follower.create({
        user: await User.findOne({id:currentUserId}),
        following: following,
    });
    console.log(follower)
    return await follower.save();
}