// socket.auth.js
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import env from "../../env.js";

const prisma = new PrismaClient();
const { JWT_SECRET } = env;

export async function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) throw new Error("Token missing");

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) throw new Error("User not found");

    // ✅ ATTACH USER
    socket.user = user;

    // ✅ CRITICAL FIX: JOIN ROOM
    socket.join(`user:${user.id}`);

    console.log("Socket connected:", user.id);

    next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    next(new Error("Unauthorized"));
  }
}
