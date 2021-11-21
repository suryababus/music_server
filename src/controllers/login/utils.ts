import { User } from "../../entities/user";

export async function searchUsers(name : any){
    return User.createQueryBuilder("user").where("user.first_name ILIKE :name", {
      name: `%${name}%`,
    }).limit(50)
    .getMany()
}