import mongoose from "mongoose";

export enum SUBMISSION_STATUS {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

const ReviewSchema = new mongoose.Schema(
  {
    refProduct: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },

    teamMember: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: [
        SUBMISSION_STATUS.PENDING,
        SUBMISSION_STATUS.APPROVED,
        SUBMISSION_STATUS.REJECTED,
      ],
      default: SUBMISSION_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default ReviewModel;
