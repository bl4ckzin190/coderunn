
    const entry = {
        id: Date.now(),
        groupName: req.body.groupName,
        timeInSeconds: req.body.timeInSeconds,
        timestamp: new Date().toISOString()
    };

    ranking.push(entry);

    await saveRanking(ranking);

    res.json({ success: true, entry });
});

app.delete("/ranking", async (req, res) => {
    await saveRanking([]);
    res.json({ success: true, message: "Ranking limpo" });
});

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
