class eventClass {


    id;
    ip_address;
    category;
    description;
    createtimestamp;

    constructor(dbItem)
    {

        this.id = dbItem.id;
        this.ip_address = dbItem.ip_address;
        this.category = dbItem.category;
        this.description = dbItem.description;
        this.createtimestamp = dbItem.createtimestamp;
    }
}


module.exports = eventClass;