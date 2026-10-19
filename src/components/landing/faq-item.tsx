"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}
 
export function FaqItem({ id, question, answer, open, onToggle }: FaqItemProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-neutral-800"
        >
          {question}
          {open ? <Minus className="size-4 shrink-0" aria-hidden /> : <Plus className="size-4 shrink-0" aria-hidden />}
        </button>
      </h3>
 
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <p className="mx-5 border-t border-neutral-200 py-4 text-xs leading-relaxed text-neutral-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}