import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CustomCursor } from "@/components/common/CustomCursor";
import { FilmGrain } from "@/components/common/FilmGrain";
import { TextureDevToolbar } from "@/components/common/TextureDevToolbar";
import { BookingProvider } from "@/components/contact/BookingProvider";
import { getEnquiryConfig, getSite } from "@/cms/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <>
      <FilmGrain />
      <CustomCursor />
      <TextureDevToolbar />
      <SmoothScroll>
        <BookingProvider
          config={getEnquiryConfig()}
          brandName={site.brandName}
          ownerName={site.name}
          whatsapp={site.whatsapp}
        >
          {children}
        </BookingProvider>
      </SmoothScroll>
    </>
  );
}
