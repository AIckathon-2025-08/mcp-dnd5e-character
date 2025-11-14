import React, { useState } from "react";
import { generateCharacter, RACES, CLASSES } from "../../src/characterGenerator.js";

type GeneratorInput = {
  race?: string;
  class?: string;
  level?: number;
};

export const App: React.FC = () => {
  const [race, setRace] = useState<string>("any");
  const [charClass, setCharClass] = useState<string>("any");
  const [level, setLevel] = useState<number>(1);
  const [result, setResult] = useState<any | null>(null);

  const handleGenerate = () => {
    const input: GeneratorInput = {};

    if (race !== "any") {
      input.race = race;
    }
    if (charClass !== "any") {
      input.class = charClass;
    }
    if (level >= 1 && level <= 5) {
      input.level = level;
    }

    const character = generateCharacter(input);
    setResult(character);
  };

  return (
    <div className="app">
      <h1>D&D 5e Character Generator (Web UI)</h1>
      <p className="subtitle">
        Generate lightweight, D&D-flavored characters using the same logic as the MCP server.
      </p>

      <div className="card">
        <div className="field-row">
          <label htmlFor="race">Race</label>
          <select
            id="race"
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            <option value="any">Any</option>
            {RACES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <label htmlFor="class">Class</label>
          <select
            id="class"
            value={charClass}
            onChange={(e) => setCharClass(e.target.value)}
          >
            <option value="any">Any</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <label htmlFor="level">Level (1–5)</label>
          <input
            id="level"
            type="number"
            min={1}
            max={5}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value) || 1)}
          />
        </div>

        <button className="generate-button" onClick={handleGenerate}>
          Generate character
        </button>
      </div>

      {result && (
        <div className="result">
          <h2>
            {result.name} — {result.race} {result.class} (Level {result.level})
          </h2>
          <p>
            <strong>Alignment:</strong> {result.alignment}
          </p>
          <p>
            <strong>HP:</strong> {result.hit_points} ·{" "}
            <strong>AC:</strong> {result.armor_class} ·{" "}
            <strong>Speed:</strong> {result.speed} ft
          </p>

          <h3>Abilities</h3>
          <ul className="abilities">
            <li>STR: {result.abilities.strength}</li>
            <li>DEX: {result.abilities.dexterity}</li>
            <li>CON: {result.abilities.constitution}</li>
            <li>INT: {result.abilities.intelligence}</li>
            <li>WIS: {result.abilities.wisdom}</li>
            <li>CHA: {result.abilities.charisma}</li>
          </ul>

          <h3>Skills</h3>
          <p>{result.skills.join(", ")}</p>

          <h3>Equipment</h3>
          <p>{result.equipment.join(", ")}</p>

          <h3>Background</h3>
          <p>{result.background}</p>

          <h3>Raw JSON</h3>
          <pre className="json-block">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

