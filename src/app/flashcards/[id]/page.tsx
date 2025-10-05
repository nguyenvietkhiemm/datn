"use client";
import { useParams } from "next/navigation";

export default function FlashcardDetail() {
  const params = useParams();
  const deckId = params.id;

  return (
    <div>
      <h1>Chi tiết Flashcard {deckId}</h1>
      {/* render nội dung deck */}
    </div>
  );
}
