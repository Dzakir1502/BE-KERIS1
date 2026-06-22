import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import Course from "./Course";

interface IModuleAttributes {
  id: number;
  courseId: number;
  title: string;
  description: string;
  thumbnail: string;
  order: number;
  lessons: Array<{
    id: string;
    title: string;
    type: "video" | "quiz" | "article" | "assignment";
    duration: number;
    videoUrl?: string;
    content?: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface IModuleCreationAttributes
  extends Optional<IModuleAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Module
  extends Model<IModuleAttributes, IModuleCreationAttributes>
  implements IModuleAttributes
{
  public id!: number;
  public courseId!: number;
  public title!: string;
  public description!: string;
  public thumbnail!: string;
  public order!: number;
  public lessons!: Array<{
    id: string;
    title: string;
    type: "video" | "quiz" | "article" | "assignment";
    duration: number;
    videoUrl?: string;
    content?: string;
    order: number;
  }>;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lessons: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
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
    tableName: "modules",
    timestamps: true,
  }
);

Module.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Module, { foreignKey: "courseId" });

export default Module;
