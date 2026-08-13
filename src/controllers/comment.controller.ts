import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode } from "../libs/Errors";
import CommentService from "../models/Comment.service";
import { CommentInput } from "../libs/types/comment";
import { ExtendedRequest } from "../libs/types/member";

const commentService = new CommentService();

const commentController: T = {};

commentController.getComments = async (req: Request, res: Response) => {
  try {
    console.log("getComments");
    const { productId } = req.query;
    const result = await commentService.getCommentsByProduct(
      String(productId),
    );

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getComments:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

commentController.createComment = async (
  req: ExtendedRequest,
  res: Response,
) => {
  try {
    console.log("createComment");
    const input: CommentInput = req.body;
    const result = await commentService.createComment(req.member, input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, createComment:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default commentController;
