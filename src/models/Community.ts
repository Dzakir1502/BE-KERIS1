import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";

interface IThreadAttributes {
  id: number;
  title: string;
  content: string;
  category: string;
  authorId: number;
  tags: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

interface IReplyAttributes {
  id: number;
  threadId: number;
  authorId: number;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IThreadCreationAttributes
  extends Optional<IThreadAttributes, "id" | "createdAt" | "updatedAt"> {}

interface IReplyCreationAttributes
  extends Optional<IReplyAttributes, "id" | "likes" | "createdAt" | "updatedAt"> {}

export class Thread
  extends Model<IThreadAttributes, IThreadCreationAttributes>
  implements IThreadAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public category!: string;
  public authorId!: number;
  public tags!: string;
  public views!: number;
  public likes!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastActivity!: Date;
}

export class Reply
  extends Model<IReplyAttributes, IReplyCreationAttributes>
  implements IReplyAttributes
{
  public id!: number;
  public threadId!: number;
  public authorId!: number;
  public content!: string;
  public likes!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Thread.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "threads",
    timestamps: true,
  }
);

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    threadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Thread,
        key: "id",
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "replies",
    timestamps: true,
  }
);

Thread.belongsTo(User, { as: "author", foreignKey: "authorId" });
Thread.hasMany(Reply, { foreignKey: "threadId" });
Reply.belongsTo(User, { as: "author", foreignKey: "authorId" });
Reply.belongsTo(Thread, { foreignKey: "threadId" });

export default { Thread, Reply };
