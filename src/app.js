const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0
  };

  if (repository.title && repository.url) {
    repositories.push(repository);

    return response.json(repository);
  } else {
    return response.status(400).json({ error: "Invalid title or url." });
  }
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repository = {
    id,
    title,
    url,
    techs
  };

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    ...repository
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
