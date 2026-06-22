import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Project from "./Project";
import User from "./User";

interface ISubmissionAttributes {
  id: number;
  projectId: number;
  userId: number;
  projectLink: string;
  demoLink: string;
  description: string;
  technologies: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  score?: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ISubmissionCreationAttributes
  extends Optional<ISubmissionAttributes, "id" | "status" | "feedback" | "score" | "submittedAt" | "reviewedAt" | "reviewedBy" | "createdAt" | "updatedAt"> {}

export class Submission
  extends Model<ISubmissionAttributes, ISubmissionCreationAttributes>
  implements ISubmissionAttributes
{
  declare public id: number;
  declare public projectId: number;
  declare public userId: number;
  declare public projectLink: string;
  declare public demoLink: string;
  declare public description: string;
  declare public technologies: string;
  declare public status: "pending" | "approved" | "rejected";
  declare public feedback: string;
  declare public score: number;
  declare public submittedAt: Date;
  declare public reviewedAt: Date;
  declare public reviewedBy: number;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    projectLink: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    demoLink: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "submissions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["projectId", "userId"],
      },
    ],
  }
);

Submission.belongsTo(Project, { foreignKey: "projectId" });
Submission.belongsTo(User, { as: "student", foreignKey: "userId" });
Submission.belongsTo(User, { as: "reviewer", foreignKey: "reviewedBy" });

export default Submission;
