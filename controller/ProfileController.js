import {generateURandomNum, ImageValidator} from "../utils/helper.js";
import prisma from "../Database/db.config.js";

class ProfileController{
    static async index(req,res){
        try{
            const user=req.user
            if(!user){
                res.status(401).send('No users found');
            }
            return res.status(200).json({user:user})
        }
        catch(error){
            return res.status(500).json({error:error.message})
        }
    }

    static async store(){

    }

    static async update(req,res){
        try{
            const {id}=req.params
            // const authUser=req.user

            

            if (!req.files || Object.keys(req.files).length === 0) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Profile image is required." });
            }
            const profile=req.files.profile
            const message=ImageValidator(profile?.size,profile?.mimetype)

            console.log(profile)

            if(!message){
                return res.status(400).json({
                    errors:{
                        message:message
                    }
                })
            }


            const imgExt=profile?.name.split(".")
            const imageName=generateURandomNum()+"."+imgExt[imgExt.length-1]

            const uploadPath=process.cwd()+"/public/images/"+imageName

             await new Promise((resolve,reject)=>{
                 profile.mv(uploadPath, (err) => {
                     if (err) throw err;
                     resolve();
                 })
             })

            await prisma.users.update({
                data:{
                    profile:imageName
                },
                where:{
                    id:Number(id)
                }
            })

            return res.status(200).json({
                status:200,
                message:"Profile updated successfully"
            })

            // return res.json({
            //     name:profile.name,
            //     size:profile?.size,
            //     mime:profile?.mimetype
            // })
        }
        catch (e) {
            return res.status(500).json({
                message:"Something went wrong"
            })
        }

    }

    static async delete(){

    }
}

export default ProfileController