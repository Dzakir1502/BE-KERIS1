import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";

interface IUserAttributes {
  id: number;
  email: string;
  password: string;
  nama_lengkap: string;
  no_hp: string;
  bio?: string;
  avatar?: string;
  level: number;
  points: number;
  role: "user" | "mentor" | "admin";
  isMentor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserCreationAttributes
  extends Optional<IUserAttributes, "id" | "createdAt" | "updatedAt"> {}

export class User
  extends Model<IUserAttributes, IUserCreationAttributes>
  implements IUserAttributes
{
  declare public id: number;
  declare public email: string;
  declare public password: string;
  declare public nama_lengkap: string;
  declare public no_hp: string;
  declare public bio: string;
  declare public avatar: string;
  declare public level: number;
  declare public points: number;
  declare public role: "user" | "mentor" | "admin";
  declare public isMentor: boolean;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    no_hp: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM("user", "mentor", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    isMentor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "users",
    timestamps: true,
  }
);

export default User;
