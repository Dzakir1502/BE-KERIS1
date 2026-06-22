import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface IProjectAttributes {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  thumbnail: string;
  banner: string;
  reward: {
    points: number;
    badge: string;
  };
  participants: number;
  completions: number;
  deadline: Date;
  status: "active" | "upcoming" | "closed";
  requirements: string;
  resources: string;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IProjectCreationAttributes
  extends Optional<IProjectAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Project
  extends Model<IProjectAttributes, IProjectCreationAttributes>
  implements IProjectAttributes
{
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public fullDescription: string;
  declare public difficulty: "easy" | "medium" | "hard";
  declare public category: string;
  declare public thumbnail: string;
  declare public banner: string;
  declare public reward: { points: number; badge: string };
  declare public participants: number;
  declare public completions: number;
  declare public deadline: Date;
  declare public status: "active" | "upcoming" | "closed";
  declare public requirements: string;
  declare public resources: string;
  declare public tags: string;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
      defaultValue: "easy",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    reward: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        points: 500,
        badge: "Participant",
      },
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "upcoming", "closed"),
      allowNull: false,
      defaultValue: "active",
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    resources: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;
