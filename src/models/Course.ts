import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";

interface ICourseAttributes {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  instructorId: number;
  rating: number;
  students: number;
  duration: string;
  price: number;
  learningPoints: number;
  prerequisites?: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ICourseCreationAttributes
  extends Optional<ICourseAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Course
  extends Model<ICourseAttributes, ICourseCreationAttributes>
  implements ICourseAttributes
{
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public fullDescription: string;
  declare public category: string;
  declare public level: "beginner" | "intermediate" | "advanced";
  declare public thumbnail: string;
  declare public instructorId: number;
  declare public rating: number;
  declare public students: number;
  declare public duration: string;
  declare public price: number;
  declare public learningPoints: number;
  declare public prerequisites: string;
  declare public tags: string;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

Course.init(
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
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
      defaultValue: "beginner",
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "4 weeks",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    learningPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 500,
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
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
    tableName: "courses",
    timestamps: true,
  }
);

Course.belongsTo(User, { foreignKey: "instructorId" });

export default Course;
