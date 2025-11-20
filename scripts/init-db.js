"use strict";
/**
 * Script de inicialização do banco de dados
 * Executa migrações e seed automaticamente na primeira inicialização
 *
 * Execute: node dist/scripts/init-db.js (após build)
 * Ou: tsx scripts/init-db.ts (em desenvolvimento)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const prisma = new client_1.PrismaClient();
async function initDatabase() {
    try {
        console.log('🔄 Verificando estado do banco de dados...');
        // Tentar conectar ao banco
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados');
        // Verificar se já existe alguma tabela (indicando que as migrações foram executadas)
        const tables = await prisma.$queryRaw `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      LIMIT 1
    `;
        if (tables.length === 0) {
            console.log('📦 Nenhuma tabela encontrada. Executando migrações...');
            // Executar migrações
            (0, child_process_1.execSync)('npx prisma migrate deploy', {
                stdio: 'inherit',
                env: { ...process.env }
            });
            console.log('✅ Migrações executadas com sucesso');
            // Executar seed - compilado após build
            console.log('🌱 Populando banco de dados...');
            if (process.env.NODE_ENV === 'production') {
                // Em produção, o seed já foi compilado
                (0, child_process_1.execSync)('node dist/prisma/seed.js', {
                    stdio: 'inherit',
                    env: { ...process.env }
                });
            }
            else {
                (0, child_process_1.execSync)('npx tsx prisma/seed.ts', {
                    stdio: 'inherit',
                    env: { ...process.env }
                });
            }
            console.log('✅ Banco de dados populado com sucesso');
        }
        else {
            console.log('✅ Banco de dados já configurado. Pulando migrações.');
        }
    }
    catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        // Não encerrar o processo - deixar o servidor iniciar mesmo com erro
        // O health check funcionará mesmo sem banco configurado
    }
    finally {
        await prisma.$disconnect();
    }
}
// Executar se chamado diretamente
// Verifica se está sendo executado como script principal
const isMainModule = typeof require !== 'undefined' && require.main === module;
if (isMainModule) {
    initDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
exports.default = initDatabase;
//# sourceMappingURL=init-db.js.map