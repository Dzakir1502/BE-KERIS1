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
  declare public id: number;
  declare public title: string;
  declare public content: string;
  declare public category: string;
  declare public authorId: number;
  declare public tags: string;
  declare public views: number;
  declare public likes: number;
  declare public createdAt: Date;
  declare public updatedAt: Date;
  declare public lastActivity: Date;
}

export class Reply
  extends Model<IReplyAttributes, IReplyCreationAttributes>
  implements IReplyAttributes
{
  declare public id: number;
  declare public threadId: number;
  declare public authorId: number;
  declare public content: string;
  declare public likes: number;
  declare public createdAt: Date;
  declare public updatedAt: Date;
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
