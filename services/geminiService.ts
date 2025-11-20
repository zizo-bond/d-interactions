import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SeverityLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDrugInteractions = async (drugs: string[]): Promise<AnalysisResult> => {
  if (drugs.length < 2) {
    throw new Error("الرجاء إدخال دواءين على الأقل للتحقق من التداخلات.");
  }

  const prompt = `
    قائمة الأدوية: ${drugs.join(", ")}
    
    المطلوب: تحليل شامل للتداخلات الدوائية بين هذه الأدوية.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `
          أنت صيدلي خبير وصديق للمريض. هدفك هو تبسيط المعلومات الطبية المعقدة لتكون مفهومة للجميع، مع الحفاظ على الدقة العلمية للأطباء.

          ضوابط التحليل:
          1. **الشرح (Description)**: اكتبه بلغة عربية بسيطة جداً وواضحة يفهمها المريض العادي (مثال: "هذا الدواء قد يقلل من مفعول الدواء الآخر مما يسبب ارتفاع الضغط").
          2. **الآلية (Mechanism)**: اكتبها بمصطلحات علمية دقيقة للأطباء (مثال: "Induction of CYP3A4 enzymes reduces plasma concentration").
          3. **المصطلحات**: عند ذكر اسم مرض أو عرض جانبي، اكتبه بالعربية وبجانبه الإنجليزية.
          4. **التوصية (Management)**: قدم نصيحة عملية مباشرة (مثال: "افصل بينهما بساعتين" أو "راجع الطبيب لتعديل الجرعة").
          5. **الجدية**: لا تبالغ في التخويف، ولكن كن حازماً في التداخلات الخطيرة.

          اذا لم توجد تداخلات، طمئن المستخدم بوضوح في الملخص.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "ملخص بسيط للحالة العامة موجه للمريض.",
            },
            disclaimer: {
              type: Type.STRING,
              description: "تنبيه بأن هذه المعلومات مساعدة ولا تغني عن الطبيب.",
            },
            interactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  drug1: { type: Type.STRING },
                  drug2: { type: Type.STRING },
                  severity: {
                    type: Type.STRING,
                    enum: [SeverityLevel.HIGH, SeverityLevel.MODERATE, SeverityLevel.LOW, SeverityLevel.UNKNOWN],
                  },
                  description: { type: Type.STRING, description: "شرح مبسط للمريض عن ماذا سيحدث" },
                  mechanism: { type: Type.STRING, description: "شرح علمي دقيق للطبيب أو الصيدلي" },
                  management: { type: Type.STRING, description: "خطوات عملية للحل" },
                },
                required: ["drug1", "drug2", "severity", "description", "mechanism", "management"]
              }
            }
          },
          required: ["summary", "interactions", "disclaimer"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("لم يتم استلام رد من الخادم.");
    }

    try {
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonStr) as AnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON", e);
      throw new Error("حدث خطأ أثناء معالجة البيانات الطبية. يرجى المحاولة مرة أخرى.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("API key") || error.status === 403) {
        throw new Error("مفتاح API غير صالح أو مفقود. يرجى التحقق من الإعدادات.");
    }
    if (error.status === 429 || error.message?.includes("quota")) {
        throw new Error("تم تجاوز حد الاستخدام المسموح حالياً. يرجى الانتظار قليلاً والماولة.");
    }
    if (error.status === 503 || error.status === 500) {
        throw new Error("خدمة الذكاء الاصطناعي تواجه ضغطاً حالياً. يرجى المحاولة بعد قليل.");
    }
    
    throw new Error(error.message || "حدث خطأ غير متوقع أثناء الاتصال بالخدمة.");
  }
};