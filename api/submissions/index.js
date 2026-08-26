export default async function handler(req, res) {
  if (req.method === "POST") {
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === "GET") {
    const { tokenId } = req.query;

    const response = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`,
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      },
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
