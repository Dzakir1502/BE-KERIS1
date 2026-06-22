import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";

interface IMentorAttributes {
  id: number;
  userId: number;
  specialty: string;
  bio: string;
  rating: number;
  hourlyRate: number;
  students: number;
  portfolio: string;
  reviews: string;
  availability: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IMentorCreationAttributes
  extends Optional<IMentorAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Mentor
  extends Model<IMentorAttributes, IMentorCreationAttributes>
  implements IMentorAttributes
{
  public id!: number;
  public userId!: number;
  public specialty!: string;
  public bio!: string;
  public rating!: number;
  public hourlyRate!: number;
  public students!: number;
  public portfolio!: string;
  public reviews!: string;
  public availability!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Mentor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
    specialty: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    hourlyRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    portfolio: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    reviews: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "mentors",
    timestamps: true,
  }
);

Mentor.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Mentor, { foreignKey: "userId" });

export default Mentor;
