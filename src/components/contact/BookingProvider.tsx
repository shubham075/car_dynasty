"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EnquiryConfig } from "@/cms/content";
import type { EnquirySource } from "@/cms/enquiry-constants";

// The modal is only needed after a click, so it stays out of the initial bundle.
const EnquiryModal = dynamic(() => import("./EnquiryModal").then((m) => m.EnquiryModal), { ssr: false });

interface BookingContextValue {
  open: (source?: EnquirySource) => void;
}

const BookingContext = createContext<BookingContextValue>({ open: () => {} });

export const useBooking = () => useContext(BookingContext);

interface Props {
  config: EnquiryConfig;
  brandName: string;
  ownerName: string;
  whatsapp: string;
  children: React.ReactNode;
}

export function BookingProvider({ config, brandName, ownerName, whatsapp, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<EnquirySource>({});

  const open = useCallback((s?: EnquirySource) => {
    setSource(s ?? {});
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {isOpen && (
        <EnquiryModal
          config={config}
          brandName={brandName}
          ownerName={ownerName}
          whatsapp={whatsapp}
          source={source}
          onClose={() => setIsOpen(false)}
        />
      )}
    </BookingContext.Provider>
  );
}
