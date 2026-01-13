import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
})
router.get("/adobe", (req, res) => {
    res.render("adobe");
});
router.get("/admin", (req, res) => {
    res.render("admin");
});

export default router;