/**
 * Script de inicialização do banco de dados
 * Executa migrações e seed automaticamente na primeira inicialização
 *
 * Execute: node dist/scripts/init-db.js (após build)
 * Ou: tsx scripts/init-db.ts (em desenvolvimento)
 */
declare function initDatabase(): Promise<void>;
export default initDatabase;
//# sourceMappingURL=init-db.d.ts.map