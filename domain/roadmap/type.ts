export type ResourceType =
    | "article"
    | "video"
    | "quiz"
    | "pdf"
    | "external";

export type ResourceAccess = "free" | "pro";

export interface Resource {
    type: ResourceType;
    title: string;
    url: string;
    access: ResourceAccess;
}

export interface SubStep {
    sub_step_id: number;
    title: string;
    content: string;
    resources?: Resource[];
}

export interface RoadmapStep {
    roadmap_step_id: number;
    title: string;
    description: string;
    subSteps: SubStep[];
}

export interface Roadmap {
    roadmap_id: number;
    title: string;
    description: string;
    steps: RoadmapStep[];
}

export const ROADMAPS: Roadmap[] = [
    {
        roadmap_id: 1,
        title: "Lộ trình Cơ bản",
        description:
            "Xây dựng nền tảng kiến thức vững chắc, đảm bảo không mất điểm ở các câu cơ bản.",
        steps: [
            {
                roadmap_step_id: 1,
                title: "Ôn lý thuyết nền tảng",
                description: "Nắm chắc kiến thức cốt lõi của từng chương.",
                subSteps: [
                    {
                        sub_step_id: 1,
                        title: "Khái niệm & định nghĩa",
                        content:
                            "Hiểu đúng bản chất các khái niệm, tránh nhầm lẫn giữa các đại lượng và hiện tượng.",
                        resources: [
                            {
                                type: "article",
                                title: "Giới thiệu khái niệm cơ bản",
                                url: "https://vi.wikipedia.org/wiki/V%E1%BA%ADt_l%C3%BD_h%E1%BB%8Dc",
                                access: "free",
                            },
                            {
                                type: "video",
                                title: "Video: Khái niệm nền tảng cần nhớ",
                                url: "https://www.youtube.com/watch?v=5MgBikgcWnY",
                                access: "free",
                            },
                        ],
                    },
                    {
                        sub_step_id: 2,
                        title: "Công thức cơ bản",
                        content:
                            "Ghi nhớ công thức trọng tâm, hiểu cách hình thành và ý nghĩa của từng công thức.",
                        resources: [
                            {
                                type: "article",
                                title: "Danh sách công thức vật lý THPT",
                                url: "https://hoc247.net/vat-ly/tong-hop-cong-thuc-vat-ly-lop-12-l6925.html",
                                access: "free",
                            },
                            {
                                type: "pdf",
                                title: "PDF: Công thức cần nhớ",
                                url: "https://tailieu.vn/doc/tong-hop-cong-thuc-vat-ly-thpt-2529811.html",
                                access: "free",
                            },
                        ],
                    },
                    {
                        sub_step_id: 3,
                        title: "Điều kiện áp dụng",
                        content:
                            "Biết rõ điều kiện sử dụng công thức để tránh áp dụng sai trong bài thi.",
                        resources: [
                            {
                                type: "article",
                                title: "Các lỗi sai thường gặp khi làm bài Vật lý",
                                url: "https://vndoc.com/nhung-loi-sai-thuong-gap-khi-lam-bai-thi-vat-ly-186774",
                                access: "free",
                            },
                        ],
                    },
                ],
            },
            {
                roadmap_step_id: 2,
                title: "Bài tập nhận biết",
                description: "Làm quen với dạng bài đơn giản.",
                subSteps: [
                    {
                        sub_step_id: 4,
                        title: "Áp dụng trực tiếp công thức",
                        content:
                            "Giải nhanh các bài chỉ cần thế số và tính toán cơ bản.",
                    },
                    {
                        sub_step_id: 5,
                        title: "Câu hỏi lý thuyết",
                        content:
                            "Nhận diện đúng – sai, chọn đáp án dựa trên hiểu biết lý thuyết.",
                        resources: [
                            {
                                type: "quiz",
                                title: "Quiz trắc nghiệm vật lý cơ bản",
                                url: "https://hoc247.net/vat-ly/trac-nghiem-vat-ly-l12-l6928.html",
                                access: "free",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        roadmap_id: 2,
        title: "Lộ trình Nâng cao",
        description:
            "Nâng cao tư duy, xử lý bài toán phức tạp và tối ưu điểm số.",
        steps: [
            {
                roadmap_step_id: 3,
                title: "Bài tập thông hiểu",
                description: "Rèn khả năng phân tích đề bài.",
                subSteps: [
                    {
                        sub_step_id: 6,
                        title: "Phân tích dữ kiện",
                        content:
                            "Xác định dữ kiện quan trọng, loại bỏ thông tin gây nhiễu.",
                        resources: [
                            {
                                type: "article",
                                title: "Cách phân tích đề bài trắc nghiệm",
                                url: "https://vndoc.com/cach-lam-bai-trac-nghiem-vat-ly-hieu-qua-154210",
                                access: "free",
                            },
                        ],
                    },
                    {
                        sub_step_id: 7,
                        title: "Biến đổi công thức",
                        content:
                            "Linh hoạt biến đổi công thức để phù hợp với từng dạng bài.",
                        resources: [
                            {
                                type: "video",
                                title: "Video: Kỹ thuật biến đổi công thức",
                                url: "https://www.youtube.com/watch?v=7m0gJ8zG5Xk",
                                access: "free",
                            },
                        ],
                    },
                ],
            },
            {
                roadmap_step_id: 4,
                title: "Bài tập vận dụng & vận dụng cao",
                description: "Chinh phục câu hỏi phân loại.",
                subSteps: [
                    {
                        sub_step_id: 8,
                        title: "Bài toán tổng hợp",
                        content:
                            "Kết hợp nhiều chương, nhiều kiến thức trong cùng một bài.",
                    },
                    {
                        sub_step_id: 9,
                        title: "Chiến thuật làm bài",
                        content:
                            "Chọn hướng giải nhanh, tối ưu thời gian và độ chính xác.",
                        resources: [
                            {
                                type: "article",
                                title: "Chiến thuật làm bài đạt điểm cao",
                                url: "https://vndoc.com/chien-thuat-lam-bai-thi-trac-nghiem-vat-ly-165709",
                                access: "free",
                            },
                        ],
                    },
                ],
            },
        ],
    },
];


