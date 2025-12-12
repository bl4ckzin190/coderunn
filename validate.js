export function validateEntry(data) {
    if (!data) return { ok: false, error: "Nenhum dado recebido" };

    const { groupName, timeInSeconds } = data;

    if (!groupName || typeof groupName !== "string")
        return { ok: false, error: "groupName inválido" };

    if (typeof timeInSeconds !== "number" || timeInSeconds <= 0)
        return { ok: false, error: "timeInSeconds inválido" };

    return { ok: true };
}
