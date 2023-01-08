var postCategoryEnum = require('../enums/postcategoryenum.js');

class postClass {


    id;
    header;
    createtimestamp;
    modifytimestamp;
    ispublished;
    description;
    name;
    category;
    body;

    constructor(dbItem)
    {
        this.id = dbItem.id;
        this.header = dbItem.header;
        this.createtimestamp = dbItem.createtimestamp;
        this.modifytimestamp = dbItem.modifytimestamp;
        this.ispublished = dbItem.ispublished;
        this.description = dbItem.description;
        this.name = dbItem.name;
        this.category = dbItem.category;
        this.body = dbItem.body;
    }



    getImageUrl(){
        switch(this.category){
            case postCategoryEnum.Bicycle:
                return '/images/bicycle.png';
            case postCategoryEnum.Code:
                return '/images/code.png';
            case postCategoryEnum.Gaming:
                return '/images/gaming.png';
            case postCategoryEnum.Hardware:
                return '/images/hardware.png';
            case postCategoryEnum.Life:
                return '/images/life.png';
            case postCategoryEnum.Review:
                return '/images/review.png';
            default:
                break;
        }
    }
}


module.exports = postClass;