const mysql = require("mysql2/promise");
const conf = require("../config/db");

const User = {
  getUser: async function query(params) {
    const connection = await mysql.createConnection(conf.db);
    const [results] = await connection.execute(
      "SELECT USERID, EMAIL, NOMBRE FROM USER WHERE EMAIL = ? AND PASS = ?",
      params
    );
    return results;
  },
  findById: async function query(params) {
    const connection = await mysql.createConnection(conf.db);
    const [results] = await connection.execute(
      "SELECT USERID, EMAIL, NOMBRE FROM USER WHERE USERID = ?",
      params
    );
    return results;
  },
  registerUser: async function query(params) {
    const connection = await mysql.createConnection(conf.db);
    // let [results] = [];
    try {
      const [results] = await connection.execute(
        "INSERT INTO USER(USERID, NOMBRE, EMAIL, PASS) VALUES(NULL, ?, ?, ?)",
        params
      );
      if (results.affectedRows > 0) {
        return { err: false, msg: "Usuario creado con éxito!" };
      } else {
        return {
          err: true,
          msg: "No se ha podido crear el usuario, por favor intente más tarde",
        };
      }
    } catch (error) {
      return { err: true, msg: "El correo ingresado ya existe" };
    }
  },
};

module.exports = User;
