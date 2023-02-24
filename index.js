import express from "express"

import connection, { makeQuery } from "./database.js"

const app = express()

console.log(connection.config.database)

app.set("view engine", "ejs")

app.use(express.static("public"))

app.use(express.urlencoded({ extended: false }))

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})

app.get("/", async (req, res) => {
  const result = await makeQuery(
    `SELECT Messages.message, Users.username FROM Messages JOIN Users ON Messages.user_id = Users.id`
  )
  console.log(result)
  res.render("index.ejs", { messages: result })
})

app.post("/api/messages", async (req, res) => {
  const { username = null, message = "" } = req.body

  console.log(username, message)

  let result = await makeQuery(
    `SELECT * FROM Users WHERE username = '${username}'`
  )

  if (result.length === 0) {
    await makeQuery(`INSERT INTO Users (username) VALUES ('${username}')`)
    result = await makeQuery(
      `SELECT * FROM Users WHERE username = '${username}'`
    )
  }

  const { id: userId } = result[0]
  console.log({ userId })
  await makeQuery(
    `INSERT INTO Messages (message, user_id) VALUES ('${message}', ${userId})`
  )
  res.redirect("/")
})
