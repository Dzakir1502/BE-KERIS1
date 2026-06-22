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
  public id!: number;
  public title!: string;
  public description!: string;
  public fullDescription!: string;
  public difficulty!: "easy" | "medium" | "hard";
  public category!: string;
  public thumbnail!: string;
  public banner!: string;
  public reward!: { points: number; badge: string };
  public participants!: number;
  public completions!: number;
  public deadline!: Date;
  public status!: "active" | "upcoming" | "closed";
  public requirements!: string;
  public resources!: string;
  public tags!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
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
