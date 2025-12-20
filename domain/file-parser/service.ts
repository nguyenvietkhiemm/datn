import { API_URL, getToken, getHeaders }  from "../../lib/service";
export const FileParserService = {

    async getImageUrl(filename: string): Promise<string> {
        const res = await fetch(
            `${API_URL}/file/images/signed/${filename}`,
            {
                headers: getHeaders(getToken())
            }
        );

        const json = await res.json();
        return json.data.url; 
    },
};
