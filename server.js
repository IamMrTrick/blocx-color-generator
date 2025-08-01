const app = require('./src/app');
const config = require('./config/config');

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.environment}`);
});