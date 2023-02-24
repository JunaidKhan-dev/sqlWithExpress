import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import mysql from "mysql2"
dotenv.config()

const connection = mysql.createConnection({
  host: "localhost",
  database: "message_app",
  user: "root",
  password: process.env.DB_PASSWORD,
})

connection.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Connected to database")
  }
})

export function makeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}

export default connection
