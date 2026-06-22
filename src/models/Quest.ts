import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface IQuestAttributes {
  id: number;
  title: string;
  description: string;
  xp: number;
  status: "active" | "locked" | "completed";
  level: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestCreationAttributes
  extends Optional<IQuestAttributes, "id" | "xp" | "status" | "level" | "order" | "createdAt" | "updatedAt"> {}

export class Quest
  extends Model<IQuestAttributes, IQuestCreationAttributes>
  implements IQuestAttributes
{
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public xp: number;
  declare public status: "active" | "locked" | "completed";
  declare public level: number;
  declare public order: number;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

Quest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 500 },
    status: {
      type: DataTypes.ENUM("active", "locked", "completed"),
      allowNull: false,
      defaultValue: "active",
    },
    level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "quests", timestamps: true }
);

export default Quest;
