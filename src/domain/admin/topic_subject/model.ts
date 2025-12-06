import { ValidationRules } from "./type";

export const TopicSubjectModel = {
    validate(
        data: { title?: string; description?: string; subject_id?: number | null },
        rules: ValidationRules,
        setErrors: (err: any) => void
    ) {
        const errors: any = {};

        // Validate title
        if (rules.title && (!data.title || !data.title.trim())) {
            errors.title = "Tiêu đề không được để trống!";
        }

        // Validate description
        if (rules.description && (!data.description || !data.description.trim())) {
            errors.description = "Mô tả không được để trống!";
        }

        // Validate subject
        if (rules.subject && (!data.subject_id || data.subject_id === null)) {
            errors.subject_id = "Vui lòng chọn môn học!";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    },
};