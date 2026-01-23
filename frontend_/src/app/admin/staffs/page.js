"use client";

import { useEffect, useState } from "react";

export default function StaffAdminPage() {
    const [token, setToken] = useState(null);
    const [staffs, setStaffs] = useState([]);
    const [oficinas, setOficinas] = useState([]);

    const [staffSelecionado, setStaffSelecionado] = useState("");
    const [oficinaSelecionada, setOficinaSelecionada] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        carregarStaffs();
        carregarOficinas();
    }, []);

    const carregarStaffs = async () => {
        const r = await fetch("http://localhost:3000/users/staffs/livres", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const dados = await r.json();
        setStaffs(Array.isArray(dados) ? dados : []);
    };

    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const dados = await r.json();
        setOficinas(Array.isArray(dados) ? dados : []);
    };

    const atribuirStaff = async () => {
        if (!staffSelecionado || !oficinaSelecionada) return;

        await fetch("http://localhost:3000/users/atribuir-oficina", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                staffId: staffSelecionado,
                oficinaId: oficinaSelecionada
            })
        });

        setStaffSelecionado("");
        setOficinaSelecionada("");

        carregarStaffs();
        carregarOficinas();
    };

    return (
        <div className="app-container">
            <h1>Atribuir Staff</h1>

            <select onChange={e => setStaffSelecionado(e.target.value)}>
                <option value="">Selecionar staff</option>
                {staffs.map(s => (
                    <option key={s._id} value={s._id}>
                        {s.nome} ({s.email})
                    </option>
                ))}
            </select>

            <select onChange={e => setOficinaSelecionada(e.target.value)}>
                <option value="">Selecionar oficina</option>
                {oficinas.map(o => (
                    <option key={o._id} value={o._id}>
                        {o.nome}
                    </option>
                ))}
            </select>

            <button onClick={atribuirStaff}>Atribuir</button>
        </div>
    );
}
