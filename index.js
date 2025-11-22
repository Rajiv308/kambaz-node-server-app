import express from "express";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import "dotenv/config";
import session from "express-session";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
const app = express();
// app.use(
//   cors({
//     credentials: true,
//     origin:
//       process.env.CLIENT_URL ||
//       "http://localhost:3000" ||
//       "https://kambaz-next-js-fa25-mon-git-a5-rajiv308s-projects.vercel.app/",
//   })
// );
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [
      "http://localhost:3000",
      "http://localhost:3006",
      "https://kambaz-next-js-fa25-mon-ecru.vercel.app",
      "https://kambaz-next-js-fa25-mon-git-a5-rajiv308s-projects.vercel.app",
    ];
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
