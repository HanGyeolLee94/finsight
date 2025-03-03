/**
 * Converts a File object to a Base64 string.
 * @param file - The file to be converted.
 * @returns A Promise that resolves to the Base64 string of the file's content.
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Event handler for successful conversion
        reader.onload = () => {
            // Remove the Base64 prefix (e.g., "data:application/pdf;base64,")
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
        };

        // Event handler for errors
        reader.onerror = (error) => reject(new Error("File could not be converted to Base64"));

        // Read the file as a data URL
        reader.readAsDataURL(file);
    });
};
