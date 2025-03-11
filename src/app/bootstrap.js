"use client";

import { useEffect } from "react";

export default function Bootstrap()
{
    useEffect(() => {
        async function loadBootstrap() {
            await import('bootstrap/dist/js/bootstrap.bundle.js');
        }
        loadBootstrap();
    }, []);
}