/**
 * Extracts a JSON object or array from a string that might contain extra text or markdown.
 * @param text The raw string from the AI, potentially wrapped in markdown.
 * @returns The clean JSON string, or null if no valid JSON structure is found.
 */
export function extractJsonFromString(text: string): string | null {
    if (!text || typeof text !== 'string') return null;
    const trimmedText = text.trim();

    // Try to match markdown code blocks (json or no language specified)
    const markdownMatch = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (markdownMatch && markdownMatch[1]) {
        return markdownMatch[1].trim();
    }

    // If not in a markdown block, find the first '{' or '[' and last '}' or ']'
    let startIndex = -1;
    let endIndex = -1;

    const objStartIndex = trimmedText.indexOf('{');
    const arrStartIndex = trimmedText.indexOf('[');

    if (objStartIndex !== -1 && (arrStartIndex === -1 || objStartIndex < arrStartIndex)) {
        startIndex = objStartIndex;
        endIndex = trimmedText.lastIndexOf('}');
    } else if (arrStartIndex !== -1) {
        startIndex = arrStartIndex;
        endIndex = trimmedText.lastIndexOf(']');
    }

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        return trimmedText.substring(startIndex, endIndex + 1).trim();
    }

    // Fallback for simple cases where the string itself is the JSON
    const firstChar = trimmedText.charAt(0);
    const lastChar = trimmedText.charAt(trimmedText.length - 1);
    if ((firstChar === '{' && lastChar === '}') || (firstChar === '[' && lastChar === ']')) {
        return trimmedText;
    }

    return null;
}


/**
 * Parses a JSON string, attempting to fix common AI-generated errors like unescaped backslashes.
 * @param jsonString The raw JSON string from the AI.
 * @returns The parsed JavaScript object.
 * @throws An error if the JSON is irreparably malformed.
 */
export function sanitizeAndParseJson<T>(jsonString: string): T {
    try {
        // First attempt: parse as-is
        return JSON.parse(jsonString) as T;
    } catch (initialError) {
        console.warn("[JSON_PARSE_WARN] Initial JSON.parse failed. Attempting to sanitize and retry.", initialError);
        // Second attempt: escape backslashes that are not already part of a valid escape sequence
        const sanitizedJson = jsonString.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
        try {
            const parsedData = JSON.parse(sanitizedJson) as T;
            console.log("[JSON_PARSE_SUCCESS] Successfully parsed JSON after sanitization.");
            return parsedData;
        } catch (secondaryError) {
            console.error("[JSON_PARSE_FATAL] Failed to parse JSON even after sanitization.", {
                originalString: jsonString,
                sanitizedString: sanitizedJson,
                error: secondaryError
            });
            throw new Error("AI returned a malformed JSON response that could not be automatically corrected.");
        }
    }
}