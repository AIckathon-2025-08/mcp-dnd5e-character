import { generateCharacter } from "./characterGenerator.js";

function printCharacter(
  label: string,
  input: { race?: string; class?: string; level?: number }
) {
  const character = generateCharacter(input);
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(character, null, 2));
}

function main() {
  console.log("D&D 5e Character MCP demo\n");

  printCharacter("Random character", {});

  printCharacter("Dwarf Barbarian level 1", {
    race: "Dwarf",
    class: "Barbarian",
    level: 1
  });

  printCharacter("Elf Wizard level 3", {
    race: "Elf",
    class: "Wizard",
    level: 3
  });
}

main();
