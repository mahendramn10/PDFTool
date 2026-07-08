import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home/Home";
import { NotFoundPage } from "@/pages/NotFound";
import { AboutPage } from "@/pages/About";
import { ContactPage } from "@/pages/Contact";
import { PrivacyPage } from "@/pages/Privacy";
import { TermsPage } from "@/pages/Terms";
import { BlogPage } from "@/pages/Blog";

import { MergePDFPage } from "@/pages/MergePDF";
import { SplitPDFPage } from "@/pages/SplitPDF";
import { CompressPDFPage } from "@/pages/CompressPDF";
import { RotatePDFPage } from "@/pages/RotatePDF";
import { DeletePagesPage } from "@/pages/DeletePages";
import { ExtractPagesPage } from "@/pages/ExtractPages";
import { RearrangePagesPage } from "@/pages/RearrangePages";
import { WatermarkPage } from "@/pages/Watermark";
import { PageNumbersPage } from "@/pages/PageNumbers";
import { PDFToJPGPage } from "@/pages/PDFToJPG";
import { JPGToPDFPage } from "@/pages/JPGToPDF";
import { PNGToPDFPage } from "@/pages/PNGToPDF";
import { PDFToPNGPage } from "@/pages/PDFToPNG";
import { PDFToWordPage } from "@/pages/PDFToWord";
import { WordToPDFPage } from "@/pages/WordToPDF";
import { ExcelToPDFPage } from "@/pages/ExcelToPDF";
import { PDFToExcelPage } from "@/pages/PDFToExcel";
import { PowerPointToPDFPage } from "@/pages/PowerPointToPDF";

function withLayout(element: React.ReactNode) {
  return <MainLayout>{element}</MainLayout>;
}

export const router = createBrowserRouter([
  { path: "/", element: withLayout(<Home />) },

  { path: "/merge-pdf", element: withLayout(<MergePDFPage />) },
  { path: "/split-pdf", element: withLayout(<SplitPDFPage />) },
  { path: "/compress-pdf", element: withLayout(<CompressPDFPage />) },
  { path: "/rotate-pdf", element: withLayout(<RotatePDFPage />) },
  { path: "/delete-pages", element: withLayout(<DeletePagesPage />) },
  { path: "/extract-pages", element: withLayout(<ExtractPagesPage />) },
  { path: "/rearrange-pages", element: withLayout(<RearrangePagesPage />) },
  { path: "/watermark-pdf", element: withLayout(<WatermarkPage />) },
  { path: "/page-numbers", element: withLayout(<PageNumbersPage />) },
  { path: "/pdf-to-jpg", element: withLayout(<PDFToJPGPage />) },
  { path: "/jpg-to-pdf", element: withLayout(<JPGToPDFPage />) },
  { path: "/png-to-pdf", element: withLayout(<PNGToPDFPage />) },
  { path: "/pdf-to-png", element: withLayout(<PDFToPNGPage />) },
  { path: "/pdf-to-word", element: withLayout(<PDFToWordPage />) },
  { path: "/word-to-pdf", element: withLayout(<WordToPDFPage />) },
  { path: "/excel-to-pdf", element: withLayout(<ExcelToPDFPage />) },
  { path: "/pdf-to-excel", element: withLayout(<PDFToExcelPage />) },
  { path: "/powerpoint-to-pdf", element: withLayout(<PowerPointToPDFPage />) },

  { path: "/blog", element: withLayout(<BlogPage />) },
  { path: "/about", element: withLayout(<AboutPage />) },
  { path: "/contact", element: withLayout(<ContactPage />) },
  { path: "/privacy", element: withLayout(<PrivacyPage />) },
  { path: "/terms", element: withLayout(<TermsPage />) },

  { path: "*", element: withLayout(<NotFoundPage />) },
]);
