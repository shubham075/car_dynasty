"use client";

import React from "react";
import { Button } from "@/components/common/Button";
import { useBooking } from "./BookingProvider";

type ButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick">;

/** A Button that opens the enquiry form, recording which CTA it came from. */
export function BookButton({ cta, refName, ...props }: ButtonProps & { cta: string; refName?: string }) {
  const { open } = useBooking();
  return <Button {...props} onClick={() => open({ cta, ref: refName })} />;
}
