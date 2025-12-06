"use client"
import SubjectManager from "@/component/subject/page";
import TopicManager from "@/component/topic/page";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { useState } from "react";

export default function TopicSubject() {
    const [topics, setTopics] = useState<Topic[]>([]);

    return (
        <div>
            <SubjectManager setTopics={setTopics}/>
            <TopicManager topics={topics} setTopics={setTopics}/>
        </div>
    );
}
