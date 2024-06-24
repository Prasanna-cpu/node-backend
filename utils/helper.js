import {supportedMimes} from "../config/fileSystem.js";

import {v4 as uuid} from "uuid";


export const ImageValidator=(size,mime)=>{
    if(bytesToMb(size)>5){
        return "Image must be less than 5MB";
    }

    else if(!supportedMimes.includes(mime)){
        return "Unsupported Mime format.";
    }

    return null
}

export const bytesToMb=(bytes)=>{
    return bytes/(1024*1024);
}

export const generateURandomNum=()=>{
    return uuid();
}

export const getImageUrl=(imageName)=>{
    return `${process.env.APP_URL}/images`
}