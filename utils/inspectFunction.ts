import sendMessageToEmail from "./sendMessageToEmail";

export async function inspect<T>(method:  () => Promise<T> | T): Promise<T|undefined> {
    try {
        const methodResult = await method(); // Assuming `method` could be async
        return methodResult;
    } catch (error: unknown) {
        // It's a good practice to check the type of error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (process.env.EMAIL_USER) {
            await sendMessageToEmail("Error", `Error Inspected: ${errorMessage}`, process.env.EMAIL_USER);
        } else {
            console.warn('EMAIL_USER environment variable is not defined.');
        }
        return undefined
    }
}