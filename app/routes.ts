import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("whell-games", "routes/WhellGames.tsx"),
] satisfies RouteConfig;
