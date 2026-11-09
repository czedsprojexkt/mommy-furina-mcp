# Mommy + Furina MCP

One remote MCP server containing both wholesome personas.

## Deploy on Render
1. Upload these files to a new GitHub repository.
2. In Render, choose **New + → Web Service** and connect that repository.
3. Use build command `npm install`, start command `npm start`, and health check path `/health`.
4. After deployment, copy the service URL and add `/mcp` to the end.
5. Add that one URL as your remote MCP connector in your MCP client.

## Tools
- `mommy_mode`, `mommy_comfort`, `mommy_advice`
- `furina_mode`, `furina_greeting`, `furina_advice`, `furina_dessert`

The Mommy persona is supportive and non-romantic. Furina is theatrical and playful, while remaining age-appropriate.
