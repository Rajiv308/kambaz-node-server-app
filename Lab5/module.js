const module = {
    id: "2301-DA-01",
    name: "Defence Against the Dark Arts",
    description: "This compulsory class teaches students how to defend themselves against dark magic, creatures, and curses through a curriculum that includes defensive and offensive magical training.",
    course: "HP2301"
};

export default function Module(app) {
    const getModule = (req, res) => {
        res.json(module);
    };
    const getModuleName = (req, res) => {
        res.json(module.name);
    };
    const setModuleName = (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
    };
    const getModuleDescription = (req, res) => {
        res.json(module.description);
    }
    const setModuleDescription = (req, res) => {
        const { newDescription } = req.params;
        module.description = newDescription;
        res.json(module);
    };
    app.get("/lab5/module/description/:newDescription", setModuleDescription);
    app.get("/lab5/module/description", getModuleDescription);
    app.get("/lab5/module/name/:newName", setModuleName);
    app.get("/lab5/module/name", getModuleName);
    app.get("/lab5/module", getModule);
}