import vine, {errors} from "@vinejs/vine";
import {newsSchema} from "../validation/newsValidation.js";
import {ImageValidator} from "../utils/helper.js";

class NewsController{
    static async index(req,res){

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