import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@config/database";
import User from "./User";
import Mentor from "./Mentor";
import Course from "./Course";

interface IEnrollmentAttributes {
  id: number;
  userId: number;
  mentorId: number | null;
  trackName: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface ICourseEnrollmentAttributes {
  id: number;
  userId: number;
  courseId: number;
  enrolledDate: Date;
  progress: number;
  completedLessons: string;
  completedModules: string;
  status: "active" | "completed" | "dropped";
  createdAt: Date;
  updatedAt: Date;
}

interface IEnrollmentCreationAttributes
  extends Optional<IEnrollmentAttributes, "id" | "startDate" | "progress" | "status" | "createdAt" | "updatedAt"> { }

interface ICourseEnrollmentCreationAttributes
  extends Optional<
    ICourseEnrollmentAttributes,
    "id" | "enrolledDate" | "progress" | "completedLessons" | "completedModules" | "status" | "createdAt" | "updatedAt"
  > { }

export class Enrollment
  extends Model<IEnrollmentAttributes, IEnrollmentCreationAttributes>
  implements IEnrollmentAttributes {
  public id!: number;
  public userId!: number;
  public mentorId!: number | null;
  public trackName!: string;
  public duration!: number;
  public startDate!: Date;
  public endDate!: Date;
  public progress!: number;
  public status!: "active" | "completed" | "cancelled";
  public createdAt!: Date;
  public updatedAt!: Date;
}

export class CourseEnrollment
  extends Model<ICourseEnrollmentAttributes, ICourseEnrollmentCreationAttributes>
  implements ICourseEnrollmentAttributes {
  public id!: number;
  public userId!: number;
  public courseId!: number;
  public enrolledDate!: Date;
  public progress!: number;
  public completedLessons!: string;
  public completedModules!: string;
  public status!: "active" | "completed" | "dropped";
  public createdAt!: Date;
  public updatedAt!: Date;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Mentor,
        key: "id",
      },
    },
    trackName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "active",
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
    tableName: "enrollments",
    timestamps: true,
  }
);

CourseEnrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: "id",
      },
    },
    enrolledDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    completedLessons: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    completedModules: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "dropped"),
      allowNull: false,
      defaultValue: "active",
    },
    // PERBAIKAN: Memberikan tipe data yang benar agar tidak error SQL syntax
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
    tableName: "course_enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"],
      },
    ],
  }
);

Enrollment.belongsTo(User, { foreignKey: "userId" });
Enrollment.belongsTo(Mentor, { foreignKey: "mentorId" });

CourseEnrollment.belongsTo(User, { foreignKey: "userId" });
CourseEnrollment.belongsTo(Course, { foreignKey: "courseId" });

export default { Enrollment, CourseEnrollment };