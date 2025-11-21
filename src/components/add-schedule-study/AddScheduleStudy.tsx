"use client";

import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import FormScheduleStudy from "../form-schedule-study/FormScheduleStudy";

interface StudyScheduleForm {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: "pending" | "in_progress" | "completed";
    target_question: number;
    subject_id?: number;
}

interface Props {
    setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
    isAdd : boolean
}

export default function AddScheduleStudy({isAdd, setIsAdd }: Props) {
    const [form, setForm] = useState<StudyScheduleForm>({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "pending",
        target_question: 0,
        subject_id: undefined,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <FormScheduleStudy
            form={form}
            setIsAdd={setIsAdd}
            isAdd={isAdd}
            setForm={setForm}
            error={error}
            setError={setError}
            loading={loading}
        />
    );
}
