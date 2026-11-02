"use client";
// GET /api/business-type/?context=onboarding mapped to the shape your picker already uses.
// `id` is the backend `code` (e.g. "restaurant_food").

import { useMemo } from "react";
import { useBusinessTypes } from "@/lib/api/index";
import type { BusinessType as PickerOption } from "@/features/onboarding/bussiness-types";
import retailImage from "@/assets/images/retail.svg";
import restaurantImage from "@/assets/images/Bowlfood.svg";
import hospitalImage from "@/assets/images/cross.svg";
import hotelImage from "@/assets/images/hospitality.svg";
import manufacturingImage from "@/assets/images/manifacturing.svg";
import wholesaleImage from "@/assets/images/wholesales.svg";

const imageByCode: Record<string, string> = {
  retail: retailImage,
  restaurant_food: restaurantImage,
  pharmacy: hospitalImage,
  hospitality: hotelImage,
  manufacturing: manufacturingImage,
  wholesale_distribution: wholesaleImage,
};

export function useBusinessTypeCards() {
  const query = useBusinessTypes("onboarding");

  const cards = useMemo<PickerOption[]>(
    () =>
      (query.data ?? []).flatMap((type) => {
        const image = imageByCode[type.code];
        if (!image) return []; // no local image yet: skipped
        return [
          {
            id: type.code,
            title: type.name,
            description: type.description,
            tags: type.highlights,
            image,
          },
        ];
      }),
    [query.data],
  );

  return { cards, isLoading: query.isLoading, error: query.error, refetch: query.refetch };
}