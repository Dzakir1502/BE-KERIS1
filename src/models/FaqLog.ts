import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";

interface IFaqLogAttributes {
  id: number;
  pertanyaan: string;
  userId: number | null;
  createdAt: Date;
}

interface IFaqLogCreationAttributes
  extends Optional<IFaqLogAttributes, "id" | "userId" | "createdAt"> {}

export class FaqLog
  extends Model<IFaqLogAttributes, IFaqLogCreationAttributes>
  implements IFaqLogAttributes
{
  public id!: number;
  public pertanyaan!: string;
  public userId!: number | null;
  public createdAt!: Date;
}

FaqLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pertanyaan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "log_pertanyaan_gagal",
    timestamps: false, // Kita kelola createdAt sendiri, tanpa updatedAt
  }
);

FaqLog.belongsTo(User, { foreignKey: "userId", as: "user" });

export default FaqLog;
