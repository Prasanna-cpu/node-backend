
import prisma from "../Database/db.config.js"
import vine, {errors} from "@vinejs/vine";
import {loginSchema, registerSchema} from "../validation/authValidation.js";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken";

class AuthController{
    static async register(req,res){
        try{
            const body=req.body;
            const validator=vine.compile(registerSchema)
            const payLoad=await validator.validate(body)


            const findExistingUser=await prisma.users.findUnique({
                where:{
                    email:payLoad.email,
                }
            })

            if(findExistingUser){
                return res.status(400).send({
                    errors:{
                        message:"Email already taken"
                    }
                })
            }


            const salt=bcrypt.genSaltSync(10)
            payLoad.password=bcrypt.hashSync(payLoad.password,salt)

            const user=await prisma.users.create({
                data:payLoad
            })



            return res.json({
                status:200,
                message:"User created Successfully",
                data:user
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

    static async login(req,res){
        try{
            const body=req.body;
            const validator=vine.compile(loginSchema)
            const payLoad=await validator.validate(body)

            const findUser=await prisma.users.findUnique({
                where:{
                    email:payLoad.email,
                }
            })




            if(!findUser){
                return res.status(400).json({
                    message:"No user found"
                })
            }

            else{
                if(!bcrypt.compareSync(payLoad.password,findUser.password)){
                    return res.status(400).json({
                        errors:{
                            email:"Invalid password"
                        }
                    })
                }
            }

            const payLoadData={
                id:findUser.id,
                email:findUser.email,
                name:findUser.name,
                profile:findUser.profile
            }

            const token=jwt.sign(payLoadData,process.env.JWT_SECRET,{
                expiresIn:"365d"
            });

            return res.status(200).json({message:"Logged in",access_token:`Bearer ${token}`})

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
}

export default AuthController