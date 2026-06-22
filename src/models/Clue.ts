import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Quest from "./Quest";

interface IClueAttributes {
  id: number;
  questId: number | null;
  clueCode: string;
  type: "CORE CONCEPT" | "EVIDENCE" | "RARE TOOL" | "PROOF";
  title: string;
  description: string;
  codeSnippet: string | null;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IClueCreationAttributes
  extends Optional<IClueAttributes, "id" | "questId" | "codeSnippet" | "isLocked" | "createdAt" | "updatedAt"> {}

export class Clue
  extends Model<IClueAttributes, IClueCreationAttributes>
  implements IClueAttributes
{
  declare public id: number;
  declare public questId: number | null;
  declare public clueCode: string;
  declare public type: "CORE CONCEPT" | "EVIDENCE" | "RARE TOOL" | "PROOF";
  declare public title: string;
  declare public description: string;
  declare public codeSnippet: string | null;
  declare public isLocked: boolean;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

Clue.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    questId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Quest, key: "id" },
    },
    clueCode: { type: DataTypes.STRING(20), allowNull: false },
    type: {
      type: DataTypes.ENUM("CORE CONCEPT", "EVIDENCE", "RARE TOOL", "PROOF"),
      allowNull: false,
      defaultValue: "CORE CONCEPT",
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    codeSnippet: { type: DataTypes.TEXT, allowNull: true },
    isLocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "clues", timestamps: true }
);

Clue.belongsTo(Quest, { foreignKey: "questId", as: "quest" });
Quest.hasMany(Clue, { foreignKey: "questId", as: "clues" });

export default Clue;
