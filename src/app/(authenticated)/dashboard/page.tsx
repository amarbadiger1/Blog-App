"use client";

import { useUser } from "@clerk/nextjs";
import { Todo } from "@prisma/client";
import React, { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts"

export default function Dashboard() {
    const { user } = useUser()
    const [todo, todos] = useState<Todo[]>([])
    const [SearchTerm, setSearchTerm] = useState("")

    const [debounceSearchTerm] = useDebounceValue(SearchTerm, 300)

    const fetchTodos = useCallback()

    return (
        <div>
            <h1>User Dashboard</h1>
        </div>
    );
}
