"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequirePermission({
    permission,
    permissions,
    children,
}: {
    permission: string;
    permissions: Record<string, boolean>;
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        if (!permissions["*"] && !permissions[permission]) {
            router.replace("/403");
        }
    }, [permission, permissions, router]);

    return <>{ children } </>;
}
