import vine, {errors} from "@vinejs/vine";
import {newsSchema} from "../validation/newsValidation.js";
import {generateURandomNum, ImageValidator} from "../utils/helper.js";
import prisma from "../Database/db.config.js";
import {NewsTransform} from "../transform/NewsTransform.js";

class NewsController{
    static async index(req,res){
        const news=await prisma.news.findMany({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        profile:true
                    }
                }
            }
        })
        const transformedNews=news?.map((item)=>{
            NewsTransform.transform(item)
        })

        return res.status(200).json({
            data:transformedNews
        })
    }

    static async store(req,res){
        try{
            const user=req.user
            const body=req.body
            const validator=vine.compile(newsSchema)
            const payLoad=await validator.validate(body)

            if(!req.files || Object.keys(req.files).length!==0){
                return res.status(400).send({
                    message:"Image required"
                })
            }
            const image=req.files?.image
            const message=ImageValidator(image?.size,image?.mimetype)

            if(message !==null){
                return res.status(400).send({
                    message:message
                })
            }

            const imgExt=image?.name.split(".")
            const imageName=generateURandomNum()+"."+imgExt[imgExt.length-1]

            const uploadPath=process.cwd()+"/public/images/"+imageName

            await new Promise((resolve,_)=>{
                image.mv(uploadPath, (err) => {
                    if (err) throw err;
                    resolve();
                })
            })

            payLoad.image=imageName
            payLoad.user_id=user.id

            const news=await prisma.news.create({
                data:payLoad
            })

            return res.status(200).json({
                message:"News created successfully",
                data:news
            })

        }
        catch(error){
            if(error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({error:error.message})
            }
            else{
                return res.status(500).json({error:error.message})
            }
        }

    }

    static async update(req,res){

    }

    static async show(req,res){

    }
    static async delete(req,res){

    }

}

export default NewsController