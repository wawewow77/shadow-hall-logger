module.exports = async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({
			error: "Method Not Allowed"
		});
	}

	try {
		const data = req.body;

		// ==============================
		// CEK SECRET KEY
		// ==============================

		if (data.secret !== process.env.SECRET_KEY) {
			return res.status(401).json({
				error: "Unauthorized"
			});
		}

		// ==============================
		// DATA
		// ==============================

		const player = String(data.player || "Unknown");
		const userId = Number(data.userId || 0);
		const command = String(data.command || "Unknown");
		const placeId = String(data.placeId || "Unknown");
		const jobId = String(data.jobId || "Unknown");

		// ==============================
		// DISCORD EMBED
		// ==============================

		const embed = {
			title: "⚡ ADONIS COMMAND LOGGER",

			description:
				`**${player}** menjalankan command.`,

			fields: [
				{
					name: "Command",
					value: `\`\`\`${command}\`\`\``
				},
				{
					name: "Username",
					value: player,
					inline: true
				},
				{
					name: "User ID",
					value: String(userId),
					inline: true
				},
				{
					name: "Place ID",
					value: placeId,
					inline: true
				},
				{
					name: "Job ID",
					value: `\`${jobId}\``
				}
			],

			thumbnail: userId !== 0
				? {
					url:
						`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`
				}
				: undefined,

			timestamp: new Date().toISOString(),

			footer: {
				text: "SHADOW HALL • COMMAND LOGGER"
			}
		};

		// ==============================
		// KIRIM KE DISCORD
		// ==============================

		const discordResponse = await fetch(
			process.env.DISCORD_WEBHOOK,
			{
				method: "POST",

				headers: {
					"Content-Type": "application/json"
				},

				body: JSON.stringify({
					username: "Shadow Hall Logger",
					embeds: [embed]
				})
			}
		);

		if (!discordResponse.ok) {
			const errorText = await discordResponse.text();

			console.error(
				"Discord Error:",
				discordResponse.status,
				errorText
			);

			return res.status(500).json({
				error: "Gagal mengirim ke Discord"
			});
		}

		return res.status(200).json({
			success: true
		});

	} catch (error) {
		console.error("Server Error:", error);

		return res.status(500).json({
			error: "Internal Server Error"
		});
	}
};
