class settingsClass {


    id;
    archive_view;
    about_section;

    constructor(dbItem)
    {

        this.id = dbItem.id;
        this.archive_view = dbItem.archive_view;
        this.about_section = dbItem.about_section;
    }
}


module.exports = settingsClass;