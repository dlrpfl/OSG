import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
// const SYSTEM_ROLE = `
// 당신은 한국어 신조어 및 유행어 전문가입니다.
// 사용자의 요청에 따라 창의적이고 트렌디한 단어를 생성하거나 추천해야 합니다.
// 결과는 반드시 JSON 형식으로 반환해야 하며, 불필요한 마크다운이나 코드 블록 없이 순수 JSON 문자열만 반환하세요.
// `;

// const DEFAULT_PROMPT_TEMPLATE = `
// 다음 조건에 맞는 한국어 신조어 또는 유행어를 10개 추천해주세요:
// 1. 최근 인터넷 커뮤니티나 SNS에서 자주 사용되는 단어
// 2. 2030 세대가 공감할 수 있는 단어
// 3. "word" 필드는 반드시 순수 한글로만 구성되어야 함 (특수문자, 영어, 숫자 제외)
// 4. "pronunciation" 필드 추가: 해당 단어를 영어로 소리나는 대로 표기 (Romanized)
// 5. "meaning" 필드 추가: 단어의 의미
// 6. "example_kr" 필드 추가: 단어의 사용 예시 (한국어)
// 7. "example_en" 필드 추가: 단어의 사용 예시 (영어)
// 8. "hashtags" 필드 추가: 단어와 관련된 해시태그들. 배열로 구성. 최대 5개.

// Output JSON Format:
// {
//   "words": [
//     {
//       "word": "단어 (한글만)",
//       "pronunciation": "발음 (영문 표기)",
//       "meaning": "의미",
//       "example_kr": "한국어 사용 예시",
//       "example_en": "영어 사용 예시",
//       "hashtags": ["해시태그1", "해시태그2"]
//     }
//   ]
// }
// `;
const SYSTEM_ROLE = `
당신은 한국어 신조어 및 유행어 전문가입니다.
사용자의 요청에 따라 창의적이고 트렌디한 단어를 생성하거나 추천해야 합니다.
특히, 이전에 한 번이라도 추천했던 단어는 중복하여 제공하지 않도록 엄격히 관리해야 합니다.
결과는 반드시 JSON 형식으로 반환해야 하며, 불필요한 마크다운이나 코드 블록 없이 순수 JSON 문자열만 반환하세요.
`;

const DEFAULT_PROMPT_TEMPLATE = (existingWords: string) => `
다음 조건에 맞는 한국어 신조어 또는 유행어를 10개 추천해주세요:
1. 최근 인터넷 커뮤니티나 SNS에서 자주 사용되는 단어
2. 2030 세대가 공감할 수 있는 단어
3. 기존에 추천했던 단어(${existingWords})와 중복되지 않는 새로운 단어일 것. 리스트에 있는 단어는 절대 추천하지 마세요.
4. "word" 필드는 반드시 순수 한글로만 구성되어야 함 (특수문자, 영어, 숫자 제외)
5. "pronunciation" 필드 추가: 해당 단어를 영어로 소리나는 대로 표기 (Romanized)
6. "meaning" 필드 추가: 단어 의미의 영어 번역 (English Translation of the meaning)
7. "example_kr" 필드 추가: 단어의 사용 예시 (한국어)
8. "example_en" 필드 추가: 단어의 사용 예시 (영어)

Output JSON Format:
{
  "words": [
    {
      "word": "단어 (한글만)",
      "pronunciation": "발음 (영문 표기)",
      "meaning": "Meaning in English",
      "example_kr": "한국어 사용 예시",
      "example_en": "영어 사용 예시"
    }
  ]
}
`;
// ---------------------

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });
    const imageModel = genAI.getGenerativeModel({ 
      model: 'gemini-3-pro-image-preview',
    });

    // Client can override prompt, but ROLE is fixed server-side for consistency
    const body = await req.json();
    
    // Handle Image Generation Request
    if (body.type === 'image') {
       if (!body.prompt) {
         return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
       }

       // For Image Generation, we structure the prompt specifically.
       // Note: Assuming 'gemini-3-pro-image-preview' or standard Imagen usage.
       // Since exact SDK usage for 'gemini-3' image gen differs, we'll try standard generateContent
       // or fallback to what's typical. However, usually image gen models return bytes.
       // For this implementation, I will assume the model returns a base64 string in the text response 
       // or we simply wrap the prompt.
       
       
       // Note: Since 'aspectRatio' might not be in the strict types for this SDK version, 
       // we also explicitly ask for it in the prompt to be safe.
       const imagePrompt = `Draw a high-quality illustration for: ${body.prompt}. Aspect ratio 4:3 (horizontal).`;
       const result = await imageModel.generateContent(imagePrompt);
       const response = await result.response;
       // For Gemini/Imagen models via Vertex or Studio, images are usually in inlineData
       // response.text() is often empty or a description.
       // We need to inspect candidates for inlineData.
       
       const candidates = response.candidates;
       let base64Image = '';

       if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
         for (const part of candidates[0].content.parts) {
           if (part.inlineData && part.inlineData.data) {
             base64Image = part.inlineData.data;
             break;
           }
         }
       }

       // Fallback: Check if text() actually has logic (unlikely for pure image gen but safe to keep)
       if (!base64Image) {
          const possibleText = response.text();
          if (possibleText && possibleText.length > 100) {
             // Heuristic: if it's long, might be base64 returned as text
             base64Image = possibleText;
          }
       }

       if (!base64Image) {
         console.error('No image data found in response:', JSON.stringify(result, null, 2));
         return NextResponse.json({ error: 'No image generated' }, { status: 500 });
       }
       
       return NextResponse.json({ result: base64Image, isImage: true });
    }

    // Fetch existing words to prevent duplicates
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Select only 'word' column
    const { data: existingWordsData } = await supabase
      .from('words')
      .select('word');

    const existingWordsList = existingWordsData 
      ? existingWordsData.map(w => w.word).join(', ') 
      : '';

    const userPrompt = body.prompt || DEFAULT_PROMPT_TEMPLATE(existingWordsList);

    // Combine Role and Prompt for the API call
    // Note: 'systemInstruction' is supported in newer Gemini models/SDKs.
    // For basic 'gemini-pro', we can prepend the role to the prompt or use history.
    // Here we prepend it to establishing context clearly.
    const finalPrompt = `${SYSTEM_ROLE}\n\nUser Request: ${userPrompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // Basic cleanup to ensure JSON if model adds markdown blocks
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return NextResponse.json({ result: cleanedText, usedPrompt: userPrompt });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
