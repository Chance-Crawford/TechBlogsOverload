function formatDate(date){
    // returns a formated date based on the created_at property in sequelize
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
}

module.exports = {formatDate};