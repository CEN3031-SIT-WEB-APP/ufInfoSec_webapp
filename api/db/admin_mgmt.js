'use strict';
const db_mgmt = require('./db_mgmt.js'); // Abstracts away DB interactions

let admin_mgmt_module = function () {

    async function list_users() {
        return await db_mgmt.list_users();
    };

    async function add_tile(name, description, link) {
        return await db_mgmt.add_tile(name, description, link);
    };

    async function delete_tile(id) {
        return await db_mgmt.delete_tile(id);
    };

	async function insertMeeting(values){
		return await db_mgmt.insertMeeting(values);
	}
    
    async function deleatMeeting(values){
		return await db_mgmt.deleatMeeting(values);
	}
    // Revealing Module: Return public interface
    return ({
        list_users: list_users,
        add_tile: add_tile,
        delete_tile: delete_tile,
        insertMeeting: insertMeeting,
        deleatMeeting: deleatMeeting
    });

};

module.exports = admin_mgmt_module();
