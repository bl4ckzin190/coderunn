import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------------------
//              FUNÇÃO PARA CARREGAR QUESTÕES
// --------------------------------------------------------
function loadQuestions(level) {
  const file = path.join(__dirname, "data", `questions-${level}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// --------------------------------------------------------
//        ROTAS PARA CADA CATEGORIA DE QUESTÕES
// --------------------------------------------------------
app.get("/questions/basic", (req, res) => {
  res.json(loadQuestions("basic"));
});

app.get("/questions/medium", (req, res) => {
  res.json(loadQuestions("medium"));
});

app.get("/questions/hard", (req, res) => {
  res.json(loadQuestions("hard"));
});

app.get("/questions/advanced", (req, res) => {
  res.json(loadQuestions("advanced"));
});

// --------------------------------------------------------
//            FRAGMENTOS DE CODIFICAÇÃO POR NÍVEL
// --------------------------------------------------------
const codeParts = {
  basic: "7A 19 34 22 10",
  medium: "4F 2B 90 88 01",
  hard: "81 30 11 5D 09",
  advanced: "Aguardo vocês aqui"
};

app.get("/code/:level", (req, res) => {
  const level = req.params.level;
  res.json({ code: codeParts[level] || "" });
});

// --------------------------------------------------------
//                     RANKING (GET)
app.get("/ranking", (req, res) => {
  const file = path.join(__dirname, "ranking", "ranking.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json(data);
});

//                     RANKING (POST)
app.post("/ranking", async (req, res) => {
  const { name, time } = req.body;

  const file = path.join(__dirname, "ranking", "ranking.json");
  const ranking = JSON.parse(fs.readFileSync(file, "utf8"));

  ranking.push({ name, time });

  ranking.sort((a, b) => a.time - b.time);

  await fs.writeFile(file, JSON.stringify(ranking, null, 2));

  res.json({ success: true });
});

// --------------------------------------------------------
//                     INICIAR SERVIDOR
// --------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("API online na porta " + port);
});
