import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";

interface IEnrollmentCodeAttributes {
  id: number;
  code: string;
  trackName: string;
  isUsed: boolean;
  usedByUserId: number | null;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IEnrollmentCodeCreationAttributes
  extends Optional<IEnrollmentCodeAttributes, "id" | "isUsed" | "usedByUserId" | "usedAt" | "createdAt" | "updatedAt"> { }

export class EnrollmentCode
  extends Model<IEnrollmentCodeAttributes, IEnrollmentCodeCreationAttributes>
  implements IEnrollmentCodeAttributes {
  declare public id: number;
  declare public code: string;
  declare public trackName: string;
  declare public isUsed: boolean;
  declare public usedByUserId: number | null;
  declare public usedAt: Date | null;
  declare public createdAt: Date;
  declare public updatedAt: Date;
}

EnrollmentCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    trackName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    usedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    usedAt: {
      type: DataTypes.DATE,
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
    tableName: "enrollment_codes",
    timestamps: true,
  }
);

EnrollmentCode.belongsTo(User, { foreignKey: "usedByUserId" });

export default EnrollmentCode;
