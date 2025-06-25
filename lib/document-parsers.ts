// Document parsing utilities that work in production environments

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Use dynamic import to avoid build-time issues
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    // Use dynamic import for mammoth
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX');
  }
}