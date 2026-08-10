import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "PasarWarga Jabatan", timestamp: new Date().toISOString() });
  });

  // Lazy Gemini AI initialization
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // AI Product Promo & Description Assistant
  const handleGeneratePromo = async (req: express.Request, res: express.Response) => {
    try {
      const { productName, title, category, price, sellerName, department, sellerDepartment, highlights } = req.body;
      const effectiveName = productName || title;
      const effectiveDept = department || sellerDepartment;
      const ai = getGeminiClient();

      if (!ai) {
        // High quality fallback if API key is not yet set
        const fallbackTitle = `🔥 [PROMO JABATAN] ${effectiveName || "Produk Istimewa"} - Segar & Sedap dari ${effectiveDept || "Warga Jabatan"}`;
        const fallbackDesc = `Nikmati ${effectiveName || "sajian istimewa"} homemade berkualiti tinggi yang disediakan khas oleh ${sellerName || "rakan sekerja"} dari ${effectiveDept || "jabatan kami"}.\n\n✨ Keistimewaan:\n• Dijamin bersih, halal & sedap.\n• Sedia dihantar terus ke meja kerja / aras anda atau ambil di pantry.\n• Harga istimewa warga jabatan: RM${price || "0.00"}.\n\nSila buat tempahan awal sebelum kehabisan stok!`;
        const fallbackTagline = `Pilihan No. 1 Warga Jabatan! Dijamin Puas Hati & Mudah Ambil di Pejabat.`;
        return res.json({
          title: fallbackTitle,
          description: fallbackDesc,
          tagline: fallbackTagline,
          tags: ["#MakananJabatan", "#SapotWarga", "#SedapDanSegar", "#JimatRehat"],
          suggestedBadge: "FRESH"
        });
      }

      const prompt = `Anda adalah pakar pemasaran e-dagang (Shopee/Lazada) dan perunding jualan untuk komuniti pejabat jabatan kerajaan/swasta di Malaysia.
Hasilkan teks promosi yang menarik, mesra rakan sekerja, meyakinkan dan profesional dalam Bahasa Melayu.

Maklumat Produk:
- Nama Produk: ${effectiveName}
- Kategori: ${category}
- Anggaran Harga: RM${price}
- Nama Penjual: ${sellerName}
- Bahagian / Unit Jabatan: ${effectiveDept}
- Nota Tambahan / Keistimewaan: ${highlights || "Segar, sedap, buatan sendiri"}

Sila berikan respon dalam format JSON sah dengan struktur:
{
  "title": "Tajuk produk bergaya Shopee yang menarik dengan emoji dan kata kunci",
  "description": "Penerangan lengkap produk yang membangkitkan selera atau minat (3-4 perenggan pendek dengan point keistimewaan dan info penghantaran ke meja)",
  "tagline": "Slogan promosi ringkas dan berimpak",
  "tags": ["Array", "hashtag", "relevan"],
  "suggestedBadge": "FRESH atau HOT atau TERLARIS"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Gemini promo generation error:", error);
      res.status(500).json({
        error: "Gagal menjana promo dengan AI",
        message: error.message,
      });
    }
  };

  app.post("/api/gemini/generate-promo", handleGeneratePromo);
  app.post("/api/generate-promo", handleGeneratePromo);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PasarWarga server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
