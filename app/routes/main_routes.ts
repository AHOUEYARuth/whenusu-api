/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router";
import { AuthRoutes } from "./auth_routes.js";
import { RoleRoutes } from "./role_routes.js";
import { PermissionRoutes } from "./permission_routes.js";
import { RegionRoutes } from "./region_routes.js";
import { LanguageRoutes } from "./language_routes.js";
import { CategoryRoutes } from "./category_routes.js";
import { InformantRoutes } from "./informant_routes.js";
import { TraditionRoutes } from "./tradition_routes.js";
import { FavoriteRoute } from "./favorite_routes.js";
import { UserRoutes } from "./user_routes.js";

router.group(() => {
    AuthRoutes(),
    RoleRoutes(),
    PermissionRoutes(),
    RegionRoutes(),
    LanguageRoutes(),
    CategoryRoutes(),
    InformantRoutes(),
    TraditionRoutes(),
    FavoriteRoute(),
    UserRoutes()
}).prefix('/api')