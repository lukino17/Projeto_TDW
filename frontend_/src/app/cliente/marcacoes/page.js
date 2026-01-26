"use client";

import { Suspense} from "react";
import ClienteMarcacoesContent from "./ClienteMarcacoesContent";

export default function Page(){
    return (
        <Suspense fallback={<p>A Carregar...</p>}>
        <ClienteMarcacoesContent />
        </Suspense>
    );
}