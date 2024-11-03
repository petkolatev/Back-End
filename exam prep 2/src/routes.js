import { Router } from "express";
import router from "./controllers/homeController.js";
import authController from "./controllers/authCotroller.js";
import gamesController from "./controllers/gameController.js";



const routes = Router();

routes.use(router)
routes.use('/auth', authController)
routes.use('/catalog', gamesController)

routes.use('*', (req, res) => {
    res.render('home/404', { title: '404 Page' })
})

export default routes