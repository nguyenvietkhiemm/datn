import { getToken, getHeaders, API_URL } from "../../lib/service";

export interface FetchBankParams {
    page?: number;
    topics?: number;
    search?: string;
    subject_id?: number
}

export const BankService = {
    async fetchBank(params: FetchBankParams) {
        const { page = 1, topics, search, subject_id } = params;
        console.log({page, topics, search, subject_id});
        
        const token = getToken()
        let url = `${API_URL}/banks?page=${page}`;

        if (topics) {
            url += `&topic_ids=${topics}`;
        }

        if (search && search.trim().length > 0) {
            url += `&keyword=${encodeURIComponent(search)}`;
        }
        if(subject_id){
            url += `&subject_id=${subject_id}`
        }

        url += `&available=true`
        console.log();
        

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách ngân hàng");
        }

        return res.json();
    },

    async geDetailBank(bank_id: number) {
        const token = getToken();

        const res = await fetch(`${API_URL}/banks/${bank_id}`, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async submitDoBank(
        bank_id: number,
        subject_type: number | null,
        used_time: number,
        do_bank: {
            question_id: number;
            user_answer: (number | string)[]
        }[],
        user_name: string
    ) {
        const token = getToken();

        const url = `${API_URL}/banks/submit?bank_id=${bank_id}&subject_type=${subject_type}&time_test=${used_time}&user_name=${user_name}`;

        const res = await fetch(url, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ do_bank })
        });

        return await res.json();
    },

    async getBankHistory() {
        const token = getToken();
        const url = `${API_URL}/banks/user/bank-history`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token)
        });

        return await res.json();
    },

    async getUserAnswer(history_bank_id: number, bank_id: number) {
        const token = getToken();
        const res = await fetch(`${API_URL}/banks/user-answer?bank_id=${bank_id}&history_bank_id=${history_bank_id}`,
            {
                method: "GET",
                headers: getHeaders(token)
            }
        )
        return res.json()
    }
};
