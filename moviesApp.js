const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const movieNameQuery = `
        SELECT movie_name as movieName FROM movie;`;
  const resultQuery = await db.all(movieNameQuery);
  response.send(resultQuery);
});

// API 2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addQuery = `
        INSERT INTO movie (director_id,movie_name,lead_actor)
        VALUES 
        (
            '${directorId}',
            '${movieName}',
            '${leadActor}');`;
  await db.run(addQuery);
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `
    SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const resQuery = await db.get(movieQuery);
  response.send(resQuery);
});

// API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updatedQuery = `
        UPDATE movie
        SET director_id = '${directorId}',
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
        WHERE movie_id = ${movieId};`;
  await db.run(updatedQuery);
  response.send("Movie Details Updated");
});

// API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  deleteQuery = `
        DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

// API 6

app.get("/directors/", async (request, response) => {
  const getQuery = `SELECT director_id as directorId,director_name as directorName FROM director;`;
  const resQuery = await db.all(getQuery);
  response.send(resQuery);
});

// API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directorQuery = `
        SELECT movie_name  as movieName from movie WHERE director_id = ${directorId};`;
  const queryRes = await db.all(directorQuery);
  response.send(queryRes);
});
module.exports = app;
