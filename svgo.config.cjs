// Configuración de svgo para los logos de Chamba Lab.
// Conserva los id de capa (body / face / sheen) para poder tematizarlos con CSS.
module.exports = {
    multipass: true,
    floatPrecision: 1,
    plugins: [
        {
            name: "preset-default",
            params: { overrides: { cleanupIds: false } },
        },
    ],
};
