import { Request, Response } from "express";
import { FlashcardService } from "../services/flashcard.service";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";

//flashcard controller
export const FlashcardController = {

  add: async (req: Request, res: Response) => {
    const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
      const newCard = await FlashcardService.add({
        ...req.body,
        flashcard_deck_id: Number(req.params.id),
      });
      return { status: 201, data: newCard, message: "Flashcard create successfully" };
    });
    return res.status(result.status).json(result);
  },

  update: async (req: Request, res: Response) => {
    const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
      const updated = await FlashcardService.update(Number(req.params.id), req.body);
      if (!updated) {
        return { status: 404, message: "Flashcard not found" };
      }
      return { status: 202, data: updated, message : "Flashcard update" };
    });
    return res.status(result.status).json(result);
  },

  remove: async (req: Request, res: Response) => {
    const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
      const ok = await FlashcardService.remove(Number(req.params.id));
      if (!ok) {
        return { status: 404, message: "Flashcard not found" };
      }
      return { status: 204, message: "Deleted successfully" };
    });
    return res.status(result.status).json(result);
  },
};

