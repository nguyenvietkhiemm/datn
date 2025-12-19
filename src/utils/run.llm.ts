import { spawn } from "child_process";
import path from "path";
import { runBertModel } from "./run.bert";

async function runRagModel(docxFilePath: string) {
    const pyInterpreter = path.join(
        __dirname,
        "../../venv/Scripts/python.exe"
    );
    const pyScript = path.join(__dirname, "../../microservice/llm/__request_llm__.py");

//     const outputCsv = docxFilePath.replace(/\.docx$/i, ".csv");

    return new Promise<string>((resolve, reject) => {
        const py = spawn(
            `"${pyInterpreter}"`,
            [
                `"${pyScript}"`,
                `"${docxFilePath}"`,
                // `"${outputCsv}"`
            ],
            { shell: true, env: { ...process.env, PYTHONUTF8: "1" } }
        );

        py.stdout.on("data", (data) => {
            console.log("LLM:", data.toString());
        });

        py.stderr.on("data", (err) => {
            console.error("LLM error:", err.toString());
        });

        py.on("close", (code) => {
            if (code === 0) {
                // resolve(outputCsv);
            } else {
                reject(new Error("LLM process failed"));
            }
        });
    });
}

export { runBertModel };