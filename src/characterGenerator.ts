export const RACES = ["Human", "Elf", "Dwarf", "Halfling", "Half-Orc", "Tiefling"] as const;
export const CLASSES = ["Fighter", "Wizard", "Rogue", "Cleric", "Barbarian", "Ranger", "Bard"] as const;
export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil"
] as const;

export type Race = (typeof RACES)[number];
export type ClassName = (typeof CLASSES)[number];
export type Alignment = (typeof ALIGNMENTS)[number];

export type Abilities = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type DndCharacter = {
  name: string;
  race: Race;
  class: ClassName;
  level: number;
  abilities: Abilities;
  hit_points: number;
  armor_class: number;
  speed: number;
  skills: string[];
  equipment: string[];
  background: string;
  alignment: Alignment;
};

function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rollStat(): number {
  // Simple 8–15 range to feel like 5e but stay deterministic enough
  return 8 + Math.floor(Math.random() * 8);
}

function generateAbilitiesForClass(className: ClassName): Abilities {
  let strength = rollStat();
  let dexterity = rollStat();
  let constitution = rollStat();
  let intelligence = rollStat();
  let wisdom = rollStat();
  let charisma = rollStat();

  // Very rough class-based nudges, not rules-accurate, just flavorful.
  switch (className) {
    case "Fighter":
    case "Barbarian":
      strength = clamp(strength + 2, 8, 18);
      constitution = clamp(constitution + 1, 8, 18);
      break;
    case "Rogue":
    case "Ranger":
      dexterity = clamp(dexterity + 2, 8, 18);
      wisdom = clamp(wisdom + 1, 8, 18);
      break;
    case "Wizard":
      intelligence = clamp(intelligence + 2, 8, 18);
      wisdom = clamp(wisdom + 1, 8, 18);
      break;
    case "Cleric":
      wisdom = clamp(wisdom + 2, 8, 18);
      constitution = clamp(constitution + 1, 8, 18);
      break;
    case "Bard":
      charisma = clamp(charisma + 2, 8, 18);
      dexterity = clamp(dexterity + 1, 8, 18);
      break;
  }

  return {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma
  };
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function baseHitDieForClass(className: ClassName): number {
  switch (className) {
    case "Barbarian":
      return 14;
    case "Fighter":
    case "Ranger":
      return 12;
    case "Rogue":
    case "Cleric":
    case "Bard":
      return 10;
    case "Wizard":
    default:
      return 8;
  }
}

function baseArmorClassForClass(className: ClassName): number {
  switch (className) {
    case "Barbarian":
    case "Fighter":
    case "Ranger":
      return 16;
    case "Rogue":
    case "Cleric":
    case "Bard":
      return 14;
    case "Wizard":
    default:
      return 12;
  }
}

function speedForRace(race: Race): number {
  switch (race) {
    case "Dwarf":
    case "Halfling":
      return 25;
    default:
      return 30;
  }
}

function skillsForClass(className: ClassName): string[] {
  switch (className) {
    case "Fighter":
      return ["Athletics", "Intimidation", "Perception"];
    case "Wizard":
      return ["Arcana", "History", "Investigation"];
    case "Rogue":
      return ["Stealth", "Acrobatics", "Deception"];
    case "Cleric":
      return ["Insight", "Medicine", "Religion"];
    case "Barbarian":
      return ["Athletics", "Survival", "Intimidation"];
    case "Ranger":
      return ["Survival", "Nature", "Perception"];
    case "Bard":
      return ["Performance", "Persuasion", "Deception"];
  }
}

function equipmentForClass(className: ClassName): string[] {
  switch (className) {
    case "Fighter":
      return ["Longsword", "Shield", "Chain Mail", "Explorer's Pack"];
    case "Wizard":
      return ["Quarterstaff", "Spellbook", "Component Pouch", "Scholar's Pack"];
    case "Rogue":
      return ["Shortsword", "Dagger", "Leather Armor", "Thieves' Tools"];
    case "Cleric":
      return ["Mace", "Shield", "Scale Mail", "Holy Symbol"];
    case "Barbarian":
      return ["Greataxe", "Handaxe", "Traveler's Clothes"];
    case "Ranger":
      return ["Longbow", "Shortsword", "Leather Armor", "Explorer's Pack"];
    case "Bard":
      return ["Rapier", "Lute", "Leather Armor", "Entertainer's Pack"];
  }
}

function generateName(race: Race): string {
  // Very lightweight flavor, not meant to be accurate to any setting.
  const humanNames = ["Aric", "Leona", "Marek", "Selene", "Darian", "Elara"];
  const elfNames = ["Faelar", "Lia", "Theren", "Aeris", "Erevan", "Saelihn"];
  const dwarfNames = ["Bruen", "Hilda", "Dorun", "Kathra", "Thorin", "Brenna"];
  const halflingNames = ["Milo", "Rosie", "Perrin", "Tess", "Finnan", "Cora"];
  const halfOrcNames = ["Grom", "Shura", "Durgan", "Varra", "Karg", "Ishka"];
  const tieflingNames = ["Azar", "Nyx", "Kael", "Lira", "Zariel", "Vexa"];

  switch (race) {
    case "Elf":
      return randomItem(elfNames);
    case "Dwarf":
      return randomItem(dwarfNames);
    case "Halfling":
      return randomItem(halflingNames);
    case "Half-Orc":
      return randomItem(halfOrcNames);
    case "Tiefling":
      return randomItem(tieflingNames);
    case "Human":
    default:
      return randomItem(humanNames);
  }
}

function normalizeChoice<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  return allowed.find((item) => item.toLowerCase() === lower);
}

export function generateCharacter(input: {
  race?: string;
  class?: string;
  level?: number;
}): DndCharacter {
  const chosenRace: Race = normalizeChoice(input.race, RACES) ?? randomItem(RACES);
  const chosenClass: ClassName = normalizeChoice(input.class, CLASSES) ?? randomItem(CLASSES);
  const level = input.level ?? 1;

  const abilities = generateAbilitiesForClass(chosenClass);
  const conMod = abilityModifier(abilities.constitution);
  const baseHp = baseHitDieForClass(chosenClass);
  const hitPoints = baseHp + conMod * level;
  const armorClass = baseArmorClassForClass(chosenClass);
  const speed = speedForRace(chosenRace);
  const skills = skillsForClass(chosenClass);
  const equipment = equipmentForClass(chosenClass);
  const alignment = randomItem(ALIGNMENTS);
  const name = generateName(chosenRace);

  const background =
    `${name} is a level ${level} ${chosenRace} ${chosenClass} of ${alignment} alignment. ` +
    `They are known for their ${skills[0]} and travel the world with their ${equipment[0].toLowerCase()}.`;

  return {
    name,
    race: chosenRace,
    class: chosenClass,
    level,
    abilities,
    hit_points: hitPoints,
    armor_class: armorClass,
    speed,
    skills,
    equipment,
    background,
    alignment
  };
}

