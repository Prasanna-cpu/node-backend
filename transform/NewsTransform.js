import {getImageUrl} from "../utils/helper.js";

export class NewsTransform{
    static transform(news){
        return {
            id:news.id,
            heading:news.title,
            news:news.content,
            image:getImageUrl(news.image),
            created_at:news.created_at,
            reporter:{
                id:news?.users.id,
                name:news?.users.name,
                profile:news?.users.profile
            }
        }
    }
}