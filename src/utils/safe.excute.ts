export  interface DefaultResponse<T> {
    status : number,
    message? : string,
    error? : string
    data? : T
}

export default async function safeExcute<T>(fn: () => Promise<DefaultResponse<T>>): 
    Promise<DefaultResponse<T>> {
    try {
        const { status, data, message } = await fn();
        return {
            status,
            data,
            message
        }
    } catch (error: any) {
        return {
            status: 500,
            message: "Loi thuc hien ham",
            error: error.message,
        }
    }
}